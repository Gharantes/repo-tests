# Testes de segurança do Synergia

Esta suíte verifica as quatro falhas trabalhadas na disciplina de cibersegurança, rodando contra o código do próprio repositório:

| Arquivo | Falha | O que o teste faz |
| --- | --- | --- |
| `security/01-idor.test.mjs` | **IDOR** | A Eve faz login na instituição dela e tenta ler, editar e apagar objetos da instituição da Maria só trocando o ID. |
| `security/02-criptografia-senhas.test.mjs` | **Criptografia/Senhas** | Olha no banco como a senha foi gravada. Também cobre o login sem senha, a política de senha fraca e os segredos versionados no git. |
| `security/03-injecao.test.mjs` | **Injeção de código** | Manda payloads de SQL injection e XSS para a API e varre o código-fonte atrás de SQL montado com string e de `innerHTML`/`eval`. |
| `security/04-bots.test.mjs` | **Bots** | Força bruta no login, enumeração de usuários e cadastro em massa. Espera que a rajada seja barrada com 429, 423 ou 403. |

Os testes são de caixa-preta. Eles sobem o backend de verdade, fazem requisições HTTP de verdade e conferem o resultado direto no PostgreSQL. Nada é simulado com mock.

## Como ler o resultado

Cada teste afirma o comportamento **seguro**:

- ✔ significa que a proteção existe.
- ✖ significa que a vulnerabilidade está presente, e a mensagem diz o que aconteceu, por exemplo `a Eve tomou a conta ADMIN da vítima com a senha que ela escolheu`.

Cada arquivo também tem testes de **controle**: o dono legítimo consegue usar a rota e a senha certa autentica. Eles garantem que um ✔ quer dizer "protegido", e não "a rota está quebrada para todo mundo".

### Resultado atual (26/10/2026): 19 ✔ e 26 ✖

As falhas batem com o relatório de auditoria em `docs/security-audit/`:

| Categoria | ✔ | ✖ | O que falha |
| --- | --- | --- | --- |
| IDOR | 3 | 10 | O backend não tem autenticação (C-01), e por isso qualquer pessoa lê, edita e apaga dados de qualquer instituição (C-03, A-05, A-06, A-07, M-02). A checagem de dono das notas existe, mas confia no `id-account` que o cliente manda. |
| Criptografia/Senhas | 3 | 11 | Senha em texto puro e sem sal (A-X1), login sem senha via `checkLastSeen` (C-02), senha `123` aceita, `backend/.env` versionado e senha padrão no `application-e2e.yaml` (M-04). |
| Injeção | 12 | 0 | Todo SQL usa parâmetros nomeados, e o frontend não usa `innerHTML` nem `eval`. |
| Bots | 1 | 5 | Não há limite de tentativas, bloqueio de conta nem limite de cadastro, e a API anônima confirma se um login existe. |

## Pré-requisitos

- **Node 22 ou mais novo.** A suíte usa o executor de testes nativo do Node (`node --test`), e a única dependência é o `pg`.
- **JDK 25**, para empacotar e subir o backend. É a mesma versão do `backend/`.
- **PostgreSQL** com um banco vazio para os testes. O esquema é criado pelo próprio backend (`ddl-auto: update`).
- `bash` e `curl`. No Windows, use o Git Bash.

## Como rodar

### Tudo de uma vez (recomendado)

```bash
createdb synergia_seguranca          # uma vez só

export PGHOST=localhost PGPORT=5432 PGDATABASE=synergia_seguranca
export PGUSER=seu_usuario PGPASSWORD=sua_senha

bash tests/rodar.sh
```

O `rodar.sh` instala as dependências da suíte e empacota o backend se ainda não houver um `.jar`. Depois sobe o backend apontando para esse banco, roda os testes e derruba o backend no fim.

O backend e os testes usam o **mesmo** banco, porque os testes leem o que a API gravou. Por isso as variáveis `PG*` configuram os dois.

Cada execução usa identificadores únicos e apaga, no fim, tudo o que criou. Mesmo assim, prefira um banco só para os testes.

### Com o backend já rodando

Se o backend já estiver no ar (pelo IntelliJ, `./gradlew bootRun` etc.), o `rodar.sh` usa esse mesmo backend. Também dá para chamar o npm direto:

```bash
cd tests
npm install
npm test
```

Nesse caso, as variáveis `PG*` precisam apontar para o **mesmo banco** que o backend está usando.

### Só uma categoria

```bash
bash tests/rodar.sh test:idor
bash tests/rodar.sh test:senhas
bash tests/rodar.sh test:injecao
bash tests/rodar.sh test:bots
```

### Variáveis

| Variável | Padrão | Para quê |
| --- | --- | --- |
| `API_URL` | `http://localhost:8080` | Onde o backend responde. |
| `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | `localhost`, `5432`, `synergia_seguranca`, `postgres`, (vazio) | Banco usado pelo backend e pelos testes. |
| `PG_URL` | (vazio) | Alternativa às variáveis `PG*`, no formato `postgres://usuario:senha@host:porta/banco`. Vale só para os testes. |
| `BOT_TENTATIVAS` | `20` | Tamanho da rajada nos testes de bots. |

## No GitHub Actions

O pipeline antigo da atividade de DevOps foi movido para `.github/workflows-backup-1/`. Fora de `.github/workflows/`, ele não roda mais. Os dois workflows novos são:

### `testes-seguranca.yml`: testes no Pull Request

Roda em todo PR para a `main`, e também manualmente pela aba Actions. Ele sobe um PostgreSQL efêmero, empacota o backend do PR e executa `bash tests/rodar.sh test:ci`, o mesmo script da máquina local.

O relatório JUnit e o log do backend ficam nos artefatos do job.

Para o PR ficar **bloqueado** enquanto houver falha de segurança, abra *Settings → Branches → regra da `main`* e marque o check **Testes de segurança** como obrigatório.

### `deploy.yml`: deploy contínuo no Render

Roda a cada push na `main`, ou seja, a cada PR aceito:

1. **verificar**: roda os testes de unidade e constrói a imagem do `backend/Dockerfile`, que é a mesma que o Render constrói.
2. **deploy**: dispara o Deploy Hook do Render, espera a versão nova ficar `live` e faz um teste de fumaça em `https://repo-tests.onrender.com`.

Configuração, feita uma vez só:

1. No Render, abra o serviço do backend. Em *Settings*, desligue o **Auto-Deploy**, para que só o workflow publique, e copie a URL do **Deploy Hook**.
2. No GitHub, em *Settings → Secrets and variables → Actions*, crie:
   - `RENDER_DEPLOY_HOOK_URL`: a URL do Deploy Hook. É **obrigatório**.
   - `RENDER_API_KEY`: uma chave criada em *Account Settings → API Keys* do Render. É **opcional**. Com ela, o job espera o deploy terminar e fica vermelho se o Render falhar.

O deploy depende dos testes de unidade, e não da suíte de segurança. Se dependesse dela, nada seria publicado enquanto as falhas da tabela acima continuassem abertas. Depois que elas forem corrigidas, basta pôr o job de segurança no `needs:` do deploy.

## Estrutura

```
tests/
├── rodar.sh                  sobe o backend (se preciso) e roda a suíte
├── package.json              scripts npm e a única dependência (pg)
├── lib/
│   ├── api.mjs               cliente HTTP e login; leva o token/cookie quando houver autenticação
│   ├── db.mjs                acesso ao Postgres e limpeza (reaproveita o delete-tenant.sql do backend)
│   └── massa.mjs             cria instituições, contas, projetos etc. pela própria API
└── security/
    ├── 01-idor.test.mjs
    ├── 02-criptografia-senhas.test.mjs
    ├── 03-injecao.test.mjs
    └── 04-bots.test.mjs      roda por último: quando houver limite de taxa, pode travar o IP por um tempo
```

A sessão em `lib/api.mjs` já repassa o cookie ou o token que o login devolver. Quando o backend ganhar autenticação de verdade, os testes continuam valendo sem mudança.
