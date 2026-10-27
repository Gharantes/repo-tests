// Cliente HTTP da suíte de segurança.
//
// Os testes são caixa-preta: falam com o backend rodando, pela rede, do mesmo
// jeito que o navegador (ou um atacante com curl) falaria. Nada de mock.
//
// A sessão é genérica de propósito. Hoje o login do Synergia não devolve token
// nenhum, então todo cliente é, na prática, anônimo - e é exatamente isso que
// os testes de IDOR denunciam. Quando o backend ganhar autenticação de verdade,
// a sessão passa a carregar sozinha o que o login devolver (cookie de sessão
// ou token no corpo/cabeçalho) e os mesmos testes continuam valendo.

export const API_URL = (process.env.API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

const CAMPOS_DE_TOKEN = ['token', 'accessToken', 'access_token', 'jwt'];

export class Cliente {
  constructor({ token = null, cookies = [] } = {}) {
    this.token = token;
    this.cookies = cookies;
  }

  get autenticado() {
    return Boolean(this.token || this.cookies.length);
  }

  async req(metodo, caminho, { query, corpo, cabecalhos = {} } = {}) {
    const url = new URL(API_URL + caminho);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }

    const headers = { ...cabecalhos };
    if (corpo !== undefined) headers['Content-Type'] = 'application/json';
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    if (this.cookies.length) headers.Cookie = this.cookies.join('; ');

    const resp = await fetch(url, {
      method: metodo,
      headers,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      redirect: 'manual',
    });

    const texto = await resp.text();
    let json = null;
    try {
      json = texto ? JSON.parse(texto) : null;
    } catch {
      // Corpo que não é JSON fica só em `texto`.
    }
    return { status: resp.status, ok: resp.ok, headers: resp.headers, texto, json };
  }

  get(caminho, opcoes) { return this.req('GET', caminho, opcoes); }
  post(caminho, opcoes) { return this.req('POST', caminho, opcoes); }
  delete(caminho, opcoes) { return this.req('DELETE', caminho, opcoes); }
}

export const anonimo = () => new Cliente();

/** Login pela tela normal (com senha). Devolve a resposta crua e a sessão que ela abriu. */
export async function login(idTenant, usuario, senha, { checkLastSeen = false } = {}) {
  const resposta = await anonimo().post('/api/page-login/check-login-information', {
    corpo: { idTenant, login: usuario, password: senha, checkLastSeen },
  });

  const cookies = resposta.headers.getSetCookie().map((c) => c.split(';')[0]);
  const doCabecalho = resposta.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const doCorpo = CAMPOS_DE_TOKEN.map((c) => resposta.json?.[c]).find(Boolean);

  return { resposta, sessao: new Cliente({ token: doCabecalho ?? doCorpo ?? null, cookies }) };
}

/** O login "deu certo" quando o backend devolve a conta. Hoje, falha é 200 com corpo vazio. */
export const loginAceito = (resposta) => resposta.ok && Boolean(resposta.json?.idAccount);

/** Qualquer coisa fora de 2xx conta como "o servidor recusou". */
export const recusado = (resposta) => !resposta.ok;

/** Status que significam "o robô foi barrado": limite de taxa, conta travada ou desafio. */
export const STATUS_DE_BLOQUEIO = [403, 423, 429];

/** Espera o backend responder, para a suíte falhar com mensagem clara se ele não estiver no ar. */
export async function garantirBackendNoAr() {
  try {
    await fetch(`${API_URL}/api/entity-tenant/list-all-tenants`, { method: 'POST' });
  } catch (erro) {
    throw new Error(
      `Backend fora do ar em ${API_URL}. Suba o backend antes (ver tests/README.md). Causa: ${erro.cause?.code ?? erro.message}`,
    );
  }
}
