# Proteção da branch principal: Synergia

**Disciplina:** DevOps, Aula 05, Projeto Integrador (Parte 4)
**Autor:** Guilherme Harmatiuk Arantes
**Versão:** 1.0
**Data:** 08/09/2026

---

## 1. O que foi entregue

A branch `main` passou a ter regra de proteção, e o pipeline da parte 3 virou
condição para entrar nela. Configuração aplicada:

| Regra | Valor | O que impede |
| --- | --- | --- |
| Pull request obrigatório | sim | commit direto na `main` |
| Aprovações exigidas | 1 | merge sem ninguém ter olhado |
| Aprovação descartada a cada novo commit | sim | aprovar, empurrar outra coisa e mesclar |
| Check obrigatório | **Resultado dos testes** | merge com o pipeline vermelho ou não executado |
| Branch atualizada antes do merge (`strict`) | sim | mesclar um PR testado contra uma `main` velha |
| Conversas resolvidas | sim | merge com comentário de revisão pendente |
| Force push | bloqueado | reescrever o histórico da `main` |
| Apagar a branch | bloqueado | sumir com a `main` |
| Vale para administradores | **não** | (ver seção 4) |

E, junto, um **interruptor para testar tudo isso sem quebrar código de verdade**
- a seção 3 explica.

O check obrigatório é um só, `Resultado dos testes`, e é de propósito: ele é o
job que confere as três camadas (unidade, integração e sistema) e falha se
qualquer uma falhar. Exigir esse resumo em vez dos três jobs evita ter que mexer
na configuração da proteção toda vez que um job for renomeado ou acrescentado.

---

## 2. Por que cada regra está aí

**Pull request obrigatório** é o que transforma "eu prometo rodar os testes" em
"o GitHub não deixa entrar sem rodar". Sem isso, a proteção seria um acordo de
cavalheiros comigo mesmo.

**O check obrigatório** é o coração da entrega. `Resultado dos testes` só fica
verde quando os 150 testes passam, num PostgreSQL que nasce e morre dentro da
execução. Enquanto ele não fecha, o botão de merge fica indisponível - não é
aviso, é bloqueio.

**Aprovação descartada a cada novo commit** fecha um buraco fácil de esquecer:
sem ela, um PR aprovado aceita commits novos depois da aprovação, e entra na
`main` código que ninguém revisou.

**`strict` (branch atualizada antes do merge)** cobre o caso de dois PRs verdes
isoladamente que quebram quando juntos. Com ele, o PR precisa incorporar a `main`
atual e rodar o pipeline de novo antes de entrar.

**Force push e exclusão bloqueados** protegem o histórico. Um `git push --force`
na `main` apaga trabalho de forma difícil de recuperar, e não existe motivo
legítimo para isso numa branch principal.

---

## 3. Como testar a proteção sem quebrar nada

O jeito óbvio de testar seria estragar um teste de propósito, ver o pipeline
ficar vermelho e depois consertar. É trabalhoso e suja o histórico. No lugar
disso, o pipeline ganhou um interruptor: **o marcador `[falhar-ci]`**.

Escrito na mensagem do commit ou no título do PR, ele faz o job de unidade
falhar de propósito, em segundos, no primeiro passo:

```yaml
- name: Interruptor de falha proposital
  env:
    TITULO_DO_PR: ${{ github.event.pull_request.title }}
  run: |
    MENSAGEM_DO_COMMIT=$(git log -1 --pretty=%B)
    if printf '%s\n%s' "$MENSAGEM_DO_COMMIT" "$TITULO_DO_PR" | grep -qF '[falhar-ci]'; then
      echo "::error::Falha proposital: o marcador [falhar-ci] está presente."
      exit 1
    fi
```

Como os outros dois jobs dependem do de unidade, eles são pulados, e o
`Resultado dos testes` fica vermelho - exatamente o estado que a proteção deve
barrar.

O título do PR entra por `env`, e não interpolado direto no script. Texto que
vem de fora - e o título de um PR é texto que qualquer pessoa escreve - nunca
deve ser colado dentro de um shell.

Uma consequência que apareceu na prática: **o commit que criou o interruptor
citava o marcador na própria mensagem, e o interruptor disparou.** O PR nasceu
com o check vermelho e o merge bloqueado, provando que funciona, na hora errada.
O marcador é literal e não sabe distinguir uso de menção - então falar dele em
mensagem de commit ou em título de PR o aciona. Na dúvida, escreva "marcador de
falha proposital" em vez do texto entre colchetes.

### O teste, do começo ao fim

```bash
# 1. um commit vazio, sem tocar em arquivo nenhum
git checkout -b teste/protecao
git commit --allow-empty -m "Teste da proteção da main [falhar-ci]"
git push -u origin teste/protecao

# 2. abre o PR
gh pr create --title "Teste da proteção" \
             --body "PR descartável, só para ver a main barrar um pipeline vermelho."
```

Em cerca de um minuto o PR mostra:

- `Testes de unidade` — falhou, no passo "Interruptor de falha proposital"
- `Testes de integração` e `Testes de sistema (Cypress)` — pulados
- `Resultado dos testes` — falhou, e é o check exigido
- o merge indisponível, com o aviso de que checks obrigatórios não passaram

Para ver o verde no mesmo PR, sem abrir outro, é só tirar o marcador:

```bash
git commit --allow-empty --amend -m "Teste da proteção da main"
git push --force-with-lease
```

O pipeline roda de novo e o bloqueio some (restando só a aprovação). No fim:

```bash
gh pr close teste/protecao --delete-branch
```

Nenhum arquivo do projeto foi tocado em momento nenhum.

---

## 4. A questão da aprovação num repositório de uma pessoa só

O enunciado pede aprovação no PR. O GitHub não deixa ninguém aprovar o próprio
pull request. Num repositório com um único participante, exigir uma aprovação e
aplicar a regra a todos, sem exceção, significa que **nada mais entra na `main`**
até convidar alguém como colaborador.

A escolha feita foi manter a exigência de 1 aprovação e deixar
`enforce_admins: false`, ou seja: a regra vale para todo mundo, menos para
administradores do repositório. Na prática, para mim, o PR e o pipeline
continuam sendo o caminho normal, e o merge sozinho continua possível quando não
houver revisor - o botão avisa que está saindo pela exceção de administrador.

Vale ser explícito sobre o custo dessa escolha: **enquanto a exceção estiver
ligada, ela vale para tudo**, inclusive para um `git push` direto na `main`. A
proteção deixa de ser uma parede e vira uma cancela que eu consigo levantar.

Para demonstração - ou quando houver um segundo colaborador - é um comando para
cada lado:

```bash
# regra valendo para todos, inclusive administradores
gh api -X POST repos/Gharantes/repo-tests/branches/main/protection/enforce_admins

# de volta, administradores isentos
gh api -X DELETE repos/Gharantes/repo-tests/branches/main/protection/enforce_admins
```

Com a primeira ligada, um `git push origin HEAD:main` é recusado pelo servidor
com "Changes must be made through a pull request".

---

## 5. O fluxo que sobra

```
issue/tarefa
    │
    ├─> git checkout -b <branch de trabalho>
    │        commits
    │        git push -u origin <branch>
    │
    ├─> gh pr create            ──>  pipeline roda (push e PR)
    │                                     │
    │                                     ├─ unidade      30 testes
    │                                     ├─ integração   70 testes
    │                                     ├─ sistema      50 testes
    │                                     └─ Resultado dos testes  ← check exigido
    │
    ├─> revisão + aprovação
    │
    └─> merge na main (só com o check verde)
```

Foi assim que a própria parte 3 entrou: branch `ci/escuta-ipv4`, PR #3, pipeline
verde, merge.

---

## 6. Como a configuração foi aplicada

Pela API, e não a mão na interface, para ficar registrado e reproduzível:

```bash
gh api -X PUT repos/Gharantes/repo-tests/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["Resultado dos testes"] },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
JSON
```

Para conferir o que está valendo a qualquer momento:

```bash
gh api repos/Gharantes/repo-tests/branches/main/protection \
  -q '.required_status_checks.contexts,
      .required_pull_request_reviews.required_approving_review_count,
      .enforce_admins.enabled'
```

O mesmo pode ser feito pela interface, em **Settings → Branches → Add branch
protection rule**, marcando *Require a pull request before merging* (com 1
aprovação e *Dismiss stale approvals*), *Require status checks to pass* (com
`Resultado dos testes` e *Require branches to be up to date*) e *Require
conversation resolution*.

---

## 7. O que está verificado e o que não está

Sendo honesto sobre o estado de cada afirmação deste documento:

**Verificado:** a configuração está aplicada e foi lida de volta da API - check
obrigatório `Resultado dos testes`, 1 aprovação, `dismiss_stale_reviews`,
`strict`, force push e exclusão bloqueados, administradores isentos. A lógica do
marcador `[falhar-ci]` foi testada localmente nos dois sentidos: mensagem comum
segue o fluxo normal, mensagem com o marcador dispara a falha.

**Não verificado ainda:** a rejeição de um push direto na `main`. Testar isso
exige uma tentativa real de push - `git push --dry-run` não serve, porque o
`--dry-run` nem chega a acionar a verificação no servidor e relata sucesso nos
dois modos, o que chegou a me enganar durante a montagem. A tentativa de verdade
ficou por conta do dono do repositório, com o `enforce_admins` ligado (seção 4).

**A verificar na prática:** o PR de teste da seção 3, que mostra o bloqueio
acontecendo na interface. É o que fecha a entrega, e leva cerca de um minuto.
