// Reporter do `node --test` que deixa o resultado da suíte fácil de ler.
//
// Em vez da lista corrida do reporter "spec" (com stack trace de cada falha), ele:
//
//   - no terminal / log do job: agrupa por categoria e por bloco, mostra ✔/✖ e,
//     em cada falha, só a mensagem que explica o que aconteceu;
//   - no GitHub Actions: escreve um relatório em Markdown no resumo do job
//     ($GITHUB_STEP_SUMMARY), com uma tabela por categoria e a lista das
//     vulnerabilidades, e cria uma anotação por categoria com problema.
//
// Cada teste cai em uma de quatro situações:
//
//   ✔ protegido    passou;
//   ✖ vulnerável   uma asserção falhou: a proteção não existe;
//   ⚠ incompleto   outro erro (backend fora do ar, hook que quebrou...): a
//                  verificação não chegou ao fim e NÃO conta como vulnerabilidade;
//   ⚠ controle     um teste de controle falhou: a rota não funciona nem para o
//                  dono, então os ✔ da categoria podem ser falsos.
//
// Uso: node --test --test-reporter=./lib/relatorio.mjs --test-reporter-destination=stdout ...

import { appendFileSync } from 'node:fs';
import { basename } from 'node:path';

// Nome de cada categoria a partir do arquivo de teste. Arquivo novo sem entrada
// aqui aparece com o próprio nome.
const CATEGORIAS = {
  '01-idor': 'IDOR',
  '02-criptografia-senhas': 'Criptografia/Senhas',
  '03-injecao': 'Injeção',
  '04-bots': 'Bots',
};

const categoriaDoArquivo = (arquivo) => {
  const nome = basename(arquivo ?? 'desconhecido').replace(/\.test\.m?js$/, '');
  return CATEGORIAS[nome] ?? nome;
};

// "IDOR - leitura de dados..." -> "leitura de dados..." (a categoria já aparece no título).
const semPrefixo = (nome) => nome.replace(/^[^-]+ - /, '');

const ehControle = (teste) => /controle/i.test(teste.bloco ?? '') || /^controle:/i.test(teste.nome);

// Só uma asserção que falhou quer dizer "vulnerável".
const ehAssercao = (erro) => (erro?.cause ?? erro)?.code === 'ERR_ASSERTION';

const situacao = (t) =>
  t.ok ? 'protegido' : !ehAssercao(t.erro) ? 'incompleto' : ehControle(t) ? 'controle' : 'vulneravel';

// A mensagem que explica a falha, sem stack trace.
function motivo(erro) {
  if (!erro) return '';
  const causa = erro.cause ?? erro;
  let texto = String(causa?.message ?? causa ?? '');
  if (erro.failureType === 'hookFailed') texto = `a preparação dos testes falhou: ${texto}`;
  const linhas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  // assert.equal sem mensagem própria: "Expected values to be strictly equal:" + o diff.
  return linhas.slice(0, 3).join(' ').slice(0, 300);
}

const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
const soma = (categorias, campo) => categorias.reduce((total, cat) => total + cat[campo], 0);

// ---------------------------------------------------------------------------
// Montagem da árvore. O executor emite cada teste ao terminar, os filhos antes
// do pai; então os eventos de nível n ficam pendentes até o pai (nível n-1) chegar.

function montarArvore(eventos) {
  const pendentes = new Map();
  const chave = (arquivo, nivel) => `${arquivo}\u0000${nivel}`;

  for (const { tipo, dados } of eventos) {
    const filhos = pendentes.get(chave(dados.file, dados.nesting + 1)) ?? [];
    pendentes.delete(chave(dados.file, dados.nesting + 1));
    const no = {
      nome: dados.name,
      arquivo: dados.file,
      ok: tipo === 'test:pass',
      pulado: Boolean(dados.skip || dados.todo),
      erro: dados.details?.error,
      ehBloco: dados.details?.type === 'suite' || filhos.length > 0,
      filhos,
    };
    const k = chave(dados.file, dados.nesting);
    pendentes.set(k, [...(pendentes.get(k) ?? []), no]);
  }
  return [...pendentes.values()].flat();
}

// Achata a árvore em testes-folha, cada um com o bloco (describe) mais próximo.
// Quando o hook de um bloco falha, os testes dele chegam como "cancelados"; eles
// herdam o erro do hook, que é o que explica por que não rodaram.
function folhas(nos, bloco = null, saida = [], erroDoHook = null) {
  for (const no of nos) {
    if (no.ehBloco) {
      const hookFalhou = no.erro?.failureType === 'hookFailed';
      // Bloco que falhou sem filhos que falharam: erro no próprio bloco.
      if (!no.ok && !no.filhos.some((f) => !f.ok)) {
        saida.push({ nome: no.nome, arquivo: no.arquivo, bloco, ok: false, erro: no.erro });
      }
      // O "bloco" de um arquivo inteiro (nome = caminho) não é um describe de verdade.
      const ehArquivo = no.nome === no.arquivo || /\.test\.m?js$/.test(no.nome);
      folhas(no.filhos, ehArquivo ? bloco : no.nome, saida, hookFalhou ? no.erro : erroDoHook);
    } else if (!no.pulado) {
      const cancelado = no.erro?.failureType === 'cancelledByParent';
      const erro = cancelado && erroDoHook ? erroDoHook : no.erro;
      saida.push({ nome: no.nome, arquivo: no.arquivo, bloco, ok: no.ok, erro });
    }
  }
  return saida;
}

function agrupar(testes) {
  const categorias = new Map();
  for (const t of testes) {
    const nome = categoriaDoArquivo(t.arquivo);
    if (!categorias.has(nome)) categorias.set(nome, { nome, arquivo: t.arquivo ?? '', blocos: new Map() });
    const cat = categorias.get(nome);
    const bloco = t.bloco ?? '(sem bloco)';
    if (!cat.blocos.has(bloco)) cat.blocos.set(bloco, []);
    cat.blocos.get(bloco).push(t);
  }
  return [...categorias.values()]
    .sort((a, b) => a.arquivo.localeCompare(b.arquivo))
    .map((cat) => {
      const todos = [...cat.blocos.values()].flat();
      const contar = (s) => todos.filter((t) => situacao(t) === s).length;
      return {
        ...cat,
        protegidos: todos.filter((t) => t.ok && !ehControle(t)).length,
        vulneraveis: contar('vulneravel'),
        incompletos: contar('incompleto'),
        controlesQuebrados: contar('controle'),
      };
    });
}

// ---------------------------------------------------------------------------
// Saída no terminal / log do job.

function texto(categorias) {
  const cor = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.CI);
  const c = (codigo) => (s) => (cor ? `\x1b[${codigo}m${s}\x1b[0m` : s);
  const verde = c('32'), vermelho = c('31'), amarelo = c('33'), cinza = c('90'), negrito = c('1');
  const marca = { protegido: verde('✔'), vulneravel: vermelho('✖'), incompleto: amarelo('⚠'), controle: amarelo('⚠') };

  const contagem = (x) => {
    const partes = [verde(`${x.protegidos} protegido(s)`)];
    partes.push(x.vulneraveis ? vermelho(plural(x.vulneraveis, 'vulnerável', 'vulneráveis')) : verde('0 vulneráveis'));
    if (x.incompletos) partes.push(amarelo(`${x.incompletos} não concluído(s)`));
    return partes.join(cinza(' · '));
  };

  const linhas = [''];
  for (const cat of categorias) {
    linhas.push(negrito(`■ ${cat.nome}`) + '  ' + contagem(cat));
    if (cat.controlesQuebrados) {
      linhas.push(amarelo(`  ⚠ ${plural(cat.controlesQuebrados, 'controle falhou', 'controles falharam')}: a rota não funciona nem para o dono, então um ✔ nesta categoria pode não significar "protegido".`));
    }
    // Um hook que falha derruba vários testes com a mesma mensagem: ela aparece uma vez só.
    let ultimoMotivo = null;
    for (const [bloco, testes] of cat.blocos) {
      linhas.push(cinza(`  ${semPrefixo(bloco)}`));
      for (const t of testes) {
        linhas.push(`    ${marca[situacao(t)]} ${t.nome}`);
        if (t.ok) continue;
        const m = motivo(t.erro);
        if (m !== ultimoMotivo) linhas.push(cinza(`        → ${m}`));
        ultimoMotivo = m;
      }
    }
    linhas.push('');
  }

  const total = {
    protegidos: soma(categorias, 'protegidos'),
    vulneraveis: soma(categorias, 'vulneraveis'),
    incompletos: soma(categorias, 'incompletos'),
  };
  linhas.push(negrito('Resultado: ') + contagem(total), '');
  return linhas.join('\n');
}

// ---------------------------------------------------------------------------
// Resumo do job no GitHub Actions (Markdown).

const escapar = (s) => String(s).replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const EMOJI = { protegido: '✅', vulneravel: '❌', incompleto: '⚠️', controle: '⚠️' };

function markdown(categorias) {
  const protegidos = soma(categorias, 'protegidos');
  const vulneraveis = soma(categorias, 'vulneraveis');
  const incompletos = soma(categorias, 'incompletos');
  const controlesQuebrados = soma(categorias, 'controlesQuebrados');
  const commit = process.env.GITHUB_SHA ? ` · commit \`${process.env.GITHUB_SHA.slice(0, 7)}\`` : '';

  const md = ['## 🛡️ Testes de segurança', ''];
  const manchete = vulneraveis
    ? `**${plural(vulneraveis, 'vulnerabilidade encontrada', 'vulnerabilidades encontradas')}**`
    : incompletos
      ? '**Resultado incompleto**: nenhuma vulnerabilidade nas verificações que rodaram'
      : '**Nenhuma vulnerabilidade encontrada**';
  md.push(`${manchete} · ${protegidos} verificação(ões) protegida(s)${commit}`, '');

  if (incompletos) {
    md.push('> [!CAUTION]',
      `> ${incompletos} verificação(ões) não chegaram ao fim (erro na preparação ou no próprio teste, não uma falha de segurança). O resultado dessas categorias está incompleto.`, '');
  }
  if (controlesQuebrados) {
    md.push('> [!WARNING]',
      `> ${plural(controlesQuebrados, 'teste de controle falhou', 'testes de controle falharam')}: alguma rota não funciona nem para o dono legítimo. Nessas categorias, um ✅ pode querer dizer "rota quebrada" em vez de "protegido".`, '');
  }

  md.push('| Categoria | Situação | ✅ Protegido | ❌ Vulnerável | ⚠️ Não concluído |', '| --- | --- | ---: | ---: | ---: |');
  for (const cat of categorias) {
    let estado = cat.vulneraveis ? '❌ Vulnerável' : cat.incompletos ? '⚠️ Incompleto' : '✅ Protegido';
    if (cat.controlesQuebrados) estado += ' · ⚠️ controle falhou';
    md.push(`| **${escapar(cat.nome)}** | ${estado} | ${cat.protegidos} | ${cat.vulneraveis} | ${cat.incompletos || '–'} |`);
  }
  md.push('');

  for (const cat of categorias) {
    const total = cat.protegidos + cat.vulneraveis + cat.incompletos;
    const titulo = cat.vulneraveis
      ? `### ❌ ${escapar(cat.nome)}: ${cat.vulneraveis} de ${total} vulneráveis`
      : cat.incompletos
        ? `### ⚠️ ${escapar(cat.nome)}: ${cat.incompletos} de ${total} não concluídas`
        : `### ✅ ${escapar(cat.nome)}: ${plural(total, 'verificação protegida', 'verificações protegidas')}`;
    md.push(titulo, '');

    const aprovados = [];
    let ultimoMotivo = null;
    for (const [bloco, testes] of cat.blocos) {
      const ruins = testes.filter((t) => !t.ok);
      if (ruins.length) {
        md.push(`**${escapar(semPrefixo(bloco))}**`, '');
        for (const t of ruins) {
          const m = motivo(t.erro);
          const explicacao = m === ultimoMotivo ? '' : `<br>&nbsp;&nbsp;&nbsp;↳ _${escapar(m)}_`;
          md.push(`- ${EMOJI[situacao(t)]} ${escapar(t.nome)}${explicacao}`);
          ultimoMotivo = m;
        }
        md.push('');
      }
      for (const t of testes.filter((t) => t.ok)) aprovados.push(`- ✅ ${escapar(t.nome)}`);
    }
    if (aprovados.length) {
      const tudoOk = !cat.vulneraveis && !cat.incompletos && !cat.controlesQuebrados;
      const resumo = tudoOk ? 'Ver as verificações' : `${aprovados.length} passaram`;
      md.push(`<details><summary>${resumo}</summary>`, '', ...aprovados, '', '</details>', '');
    }
  }

  md.push('---', '_O relatório JUnit e o log do backend estão nos artefatos do job (`relatorio-seguranca`)._', '');
  return md.join('\n');
}

// Anotações aparecem no topo da página do run, sem precisar abrir o log.
function anotacoes(categorias) {
  return categorias
    .filter((cat) => cat.vulneraveis || cat.incompletos || cat.controlesQuebrados)
    .map((cat) => {
      const partes = [];
      if (cat.vulneraveis) partes.push(plural(cat.vulneraveis, 'vulnerabilidade', 'vulnerabilidades'));
      if (cat.incompletos) partes.push(`${cat.incompletos} verificação(ões) não concluída(s)`);
      if (cat.controlesQuebrados) partes.push(plural(cat.controlesQuebrados, 'controle falhou', 'controles falharam'));
      const nivel = cat.vulneraveis ? 'error' : 'warning';
      return `::${nivel} title=Segurança - ${cat.nome}::${partes.join(', ')}. Detalhes no resumo do job (Summary).\n`;
    })
    .join('');
}

// ---------------------------------------------------------------------------

export default async function* relatorio(fonte) {
  const eventos = [];
  for await (const evento of fonte) {
    switch (evento.type) {
      case 'test:pass':
      case 'test:fail':
        eventos.push({ tipo: evento.type, dados: evento.data });
        break;
      // O que os próprios testes escrevem no console continua aparecendo.
      case 'test:stdout':
      case 'test:stderr':
        yield evento.data.message;
        break;
    }
  }

  const categorias = agrupar(folhas(montarArvore(eventos)));
  yield texto(categorias);

  if (process.env.GITHUB_ACTIONS) yield anotacoes(categorias);
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown(categorias));
    } catch (erro) {
      yield `Não foi possível escrever o resumo do job: ${erro.message}\n`;
    }
  }
}
