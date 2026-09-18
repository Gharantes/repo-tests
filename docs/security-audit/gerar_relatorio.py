# -*- coding: utf-8 -*-
"""Gera docs/security-audit/relatorio-auditoria-seguranca.pdf a partir de achados.py,
e uma versão em Markdown (relatorio-auditoria-seguranca.md) com o mesmo conteúdo, sem os gráficos.

Uso (a partir da raiz do repositório):
    python3 -m venv docs/security-audit/.venv
    docs/security-audit/.venv/bin/pip install -r docs/security-audit/requirements.txt
    docs/security-audit/.venv/bin/python docs/security-audit/gerar_relatorio.py
"""
import io
import os
import re
import textwrap
from collections import Counter
from xml.sax.saxutils import escape

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib import font_manager  # noqa: E402

from reportlab.lib import colors  # noqa: E402
from reportlab.lib.enums import TA_CENTER, TA_LEFT  # noqa: E402
from reportlab.lib.pagesizes import A4  # noqa: E402
from reportlab.lib.styles import ParagraphStyle  # noqa: E402
from reportlab.lib.units import cm, mm  # noqa: E402
from reportlab.pdfbase import pdfmetrics  # noqa: E402
from reportlab.pdfbase.ttfonts import TTFont  # noqa: E402
from reportlab.pdfgen import canvas as rl_canvas  # noqa: E402
from reportlab.platypus import (  # noqa: E402
    BaseDocTemplate, CondPageBreak, Frame, Image, KeepTogether, NextPageTemplate,
    PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle, XPreformatted,
)

import achados as A  # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, "relatorio-auditoria-seguranca.pdf")
SAIDA_MD = os.path.join(AQUI, "relatorio-auditoria-seguranca.md")
TITULO_RELATORIO = f"Relatório de Auditoria de Segurança — {A.PROJETO}"

# ----------------------------------------------------------------------------- Textos
# Compartilhados entre o PDF e o Markdown. Usam a marcação do ReportLab (<b>);
# md() converte para Markdown.
SUBTITULO = ("Isolamento de tenant, autorização no servidor, IDOR, segredos expostos e XSS "
             "em uma aplicação Kotlin/Spring Boot + Angular.")
NOTA_METODOLOGIA = (
    "Só entram no relatório achados verificados no código desta versão. Severidade considera o "
    "deploy público em repo-tests.onrender.com e o repositório público no GitHub. Caminhos longos "
    "aparecem abreviados nas tabelas (backend/…/synergia/ = backend/src/main/kotlin/br/com/synergia/; "
    "backend/…/resources/ = backend/src/main/resources/); as issues trazem o caminho completo.")
RESUMO = (
    "O Synergia não tem autenticação no servidor. O login só confere a senha e devolve IDs; a partir daí o "
    "navegador envia o <b>id-tenant</b> e o <b>idAccount</b> que quiser, e o backend confia. Por isso o filtro "
    "por tenant, que existe em todas as listagens, não isola nada, e nenhuma rota de escrita confere posse. "
    "Somado a um modo de login que dispensa a senha e a um update de conta sem checagem, qualquer pessoa na "
    "internet consegue ler, alterar e apagar dados de todas as instituições e assumir a conta ADMIN de cada uma. "
    "Do lado positivo, não há SQL injection nem XSS: as queries são parametrizadas e o frontend usa apenas "
    "interpolação do Angular. O perfil de produção também não carrega segredos.")
INTRO_FORTES = "O que foi verificado e está correto. Cada item é evidência de cobertura da auditoria."
RISCOS = [
    ("critica", "A identidade é do cliente, não do servidor",
     "Sem Spring Security, o backend usa o id-tenant e o idAccount enviados pela requisição. Tudo o que depende "
     "de \"quem é o usuário\" pode ser falsificado com curl (C-01, A-03, A-04)."),
    ("critica", "Tomada de conta em duas chamadas",
     "O login aceita checkLastSeen=true e não compara a senha (C-02); o update de conta troca a senha de qualquer "
     "ID (C-03). Os logins e IDs necessários são públicos (A-01, M-01)."),
    ("alta", "Nenhuma rota de escrita confere posse",
     "Update e delete de contas, tags, eventos, projetos e tenants operam sobre qualquer ID (A-05, A-06, A-07). "
     "As permissões do AuthPermissionsEnum existem mas nunca são aplicadas."),
    ("alta", "Segredos no repositório público",
     "Token read-write do Nx Cloud desde o primeiro commit (A-08) e a senha MaybeLater repetida em perfis, "
     "fallbacks, build e documentação (M-04), além de senhas no histórico (B-03)."),
    ("alta", "Senhas em texto puro",
     "Qualquer leitura do banco expõe as senhas reais dos usuários (A-X1)."),
]
CADEIA = ("<b>Cadeia de ataque de ponta a ponta:</b> POST /api/entity-tenant/list-all-tenants → "
          "POST /api/entity-account/list-accounts-by-tenant?id-tenant=N (IDs e logins) → "
          "POST /api/entity-account/update/{id do ADMIN} com password nova → login normal como ADMIN. "
          "Nenhum passo exige credencial.")
INTRO_DETALHADOS = ("Ordenados por severidade dentro de cada categoria. A coluna de descrição traz o trecho de "
                    "código e a condição de explorabilidade.")
NOTA_P2 = ("A ordem P2 importa: a autenticação (item 1) é pré-requisito para que os itens 2 a 4 "
           "tenham de onde tirar o tenant e o usuário. Até lá, as medidas de P1 reduzem a exposição.")
INTRO_ISSUES = (
    f"{len(A.ISSUES)} issues prontas para copiar e colar. Cada bloco vai de <b>--- ISSUE n ---</b> a "
    "<b>--- FIM ISSUE n ---</b>: a primeira linha (# ...) é o título; a linha Labels lista as labels sugeridas; "
    "o restante é o corpo em Markdown. Achados triviais do mesmo tema foram agrupados; I-02 (credenciais do "
    "Postgres efêmero do CI) não virou issue por não ser acionável.")
NOTA_ISSUES_PDF = " Linhas longas foram quebradas para caber na página; o Markdown renderiza igual."
MAPA_SEV_LABEL = {"critical": "critica", "high": "alta", "medium": "media", "low": "baixa", "info": "info"}

# ----------------------------------------------------------------------------- Fontes
FONT_DIR = "/usr/share/fonts/truetype/dejavu"
if not os.path.isfile(os.path.join(FONT_DIR, "DejaVuSans.ttf")):
    FONT_DIR = os.path.join(matplotlib.get_data_path(), "fonts", "ttf")
pdfmetrics.registerFont(TTFont("DV", os.path.join(FONT_DIR, "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DV-B", os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("DV-M", os.path.join(FONT_DIR, "DejaVuSansMono.ttf")))
pdfmetrics.registerFontFamily("DV", normal="DV", bold="DV-B", italic="DV", boldItalic="DV-B")
for f in ("DejaVuSans.ttf", "DejaVuSans-Bold.ttf"):
    font_manager.fontManager.addfont(os.path.join(FONT_DIR, f))
plt.rcParams["font.family"] = "DejaVu Sans"

# ----------------------------------------------------------------------------- Paleta
SEV = {
    "critica": ("Crítica", "#B91C1C"),
    "alta": ("Alta", "#EA580C"),
    "media": ("Média", "#D97706"),
    "baixa": ("Baixa", "#2563EB"),
    "info": ("Informativa", "#6B7280"),
}
ORDEM_SEV = ["critica", "alta", "media", "baixa", "info"]
VERDE = "#059669"
INK = colors.HexColor("#111827")
INK2 = colors.HexColor("#374151")
MUTED = colors.HexColor("#6B7280")
LINHA = colors.HexColor("#E5E7EB")
FUNDO = colors.HexColor("#F9FAFB")
CODE_BG = colors.HexColor("#F3F4F6")
MARCA = colors.HexColor("#1F2937")

# ----------------------------------------------------------------------------- Estilos
S = {
    "body": ParagraphStyle("body", fontName="DV", fontSize=9.2, leading=13.2, textColor=INK2),
    "small": ParagraphStyle("small", fontName="DV", fontSize=7.8, leading=10.4, textColor=INK2),
    "muted": ParagraphStyle("muted", fontName="DV", fontSize=7.8, leading=10.4, textColor=MUTED),
    "h1": ParagraphStyle("h1", fontName="DV-B", fontSize=17, leading=22, textColor=INK, spaceBefore=2, spaceAfter=8),
    "h2": ParagraphStyle("h2", fontName="DV-B", fontSize=12.5, leading=16, textColor=INK, spaceBefore=12, spaceAfter=6),
    "h3": ParagraphStyle("h3", fontName="DV-B", fontSize=10, leading=13, textColor=INK, spaceBefore=8, spaceAfter=4),
    "cell": ParagraphStyle("cell", fontName="DV", fontSize=7.8, leading=10.2, textColor=INK2),
    "cellb": ParagraphStyle("cellb", fontName="DV-B", fontSize=8.2, leading=10.8, textColor=INK),
    "path": ParagraphStyle("path", fontName="DV-M", fontSize=6.9, leading=9.0, textColor=INK, wordWrap="CJK"),
    "code": ParagraphStyle("code", fontName="DV-M", fontSize=6.7, leading=8.6, textColor=INK,
                           backColor=CODE_BG, borderPadding=(3, 4, 3, 4), spaceBefore=3, spaceAfter=3),
    "th": ParagraphStyle("th", fontName="DV-B", fontSize=8, leading=10, textColor=colors.white),
    "chip": ParagraphStyle("chip", fontName="DV-B", fontSize=6.2, leading=7.6, textColor=colors.white, alignment=TA_CENTER),
    "issue": ParagraphStyle("issue", fontName="DV-M", fontSize=7.0, leading=9.1, textColor=INK,
                            backColor=CODE_BG, borderPadding=(6, 6, 6, 6), borderColor=LINHA, borderWidth=0.6),
    "kpi_n": ParagraphStyle("kpi_n", fontName="DV-B", fontSize=22, leading=26, alignment=TA_CENTER),
    "kpi_l": ParagraphStyle("kpi_l", fontName="DV", fontSize=8, leading=10, alignment=TA_CENTER, textColor=INK2),
    "cover_t": ParagraphStyle("cover_t", fontName="DV-B", fontSize=25, leading=31, textColor=INK),
    "cover_s": ParagraphStyle("cover_s", fontName="DV", fontSize=11.5, leading=16, textColor=INK2),
}

PAGE_W, PAGE_H = A4
MARGEM = 2 * cm
LARGURA = PAGE_W - 2 * MARGEM


def P(texto, estilo="body"):
    return Paragraph(texto, S[estilo])


def encurta(caminho):
    return (caminho.replace("backend/src/main/kotlin/br/com/synergia/", "backend/…/synergia/")
                   .replace("backend/src/main/resources/", "backend/…/resources/")
                   .replace("backend/src/test/kotlin/br/com/synergia/", "backend/test/…/synergia/"))


def chip(sev_key, largura=2.0 * cm):
    rotulo, cor = SEV[sev_key] if sev_key in SEV else ("Ponto forte", VERDE)
    t = Table([[Paragraph(rotulo.upper(), S["chip"])]], colWidths=[largura], rowHeights=[0.46 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(cor)),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return t


def code(texto, largura=60):
    """Trecho de código quebrado para caber na coluna de descrição."""
    linhas = []
    for linha in texto.splitlines():
        linhas.extend(textwrap.wrap(linha, largura, subsequent_indent="    ", break_long_words=True,
                                    drop_whitespace=False) or [""])
    return XPreformatted(escape("\n".join(l.rstrip() for l in linhas)), S["code"])


def tabela(dados, larguras, cabecalho=True, zebra=True, cor_cab=MARCA):
    t = Table(dados, colWidths=larguras, repeatRows=1 if cabecalho else 0)
    st = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINHA),
    ]
    if cabecalho:
        st += [("BACKGROUND", (0, 0), (-1, 0), cor_cab), ("VALIGN", (0, 0), (-1, 0), "MIDDLE")]
    if zebra:
        for i in range(1 if cabecalho else 0, len(dados)):
            if i % 2 == 0:
                st.append(("BACKGROUND", (0, i), (-1, i), FUNDO))
    t.setStyle(TableStyle(st))
    return t


# ----------------------------------------------------------------------------- Gráficos
def fig_para_image(fig, largura_cm):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=220, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    buf.seek(0)
    img = Image(buf)
    escala = (largura_cm * cm) / img.imageWidth
    img.drawWidth = largura_cm * cm
    img.drawHeight = img.imageHeight * escala
    return img


def grafico_rosca(cont):
    chaves = [k for k in ORDEM_SEV if cont.get(k)]
    valores = [cont[k] for k in chaves]
    cores = [SEV[k][1] for k in chaves]
    fig, ax = plt.subplots(figsize=(3.6, 3.6))
    wedges, _ = ax.pie(valores, colors=cores, startangle=90, counterclock=False,
                       wedgeprops=dict(width=0.36, edgecolor="white", linewidth=2))
    total = sum(valores)
    ax.text(0, 0.08, str(total), ha="center", va="center", fontsize=26, fontweight="bold", color="#111827")
    ax.text(0, -0.2, "achados", ha="center", va="center", fontsize=10, color="#6B7280")
    for w, v in zip(wedges, valores):
        ang = (w.theta2 + w.theta1) / 2
        import math
        x, y = 0.82 * math.cos(math.radians(ang)), 0.82 * math.sin(math.radians(ang))
        ax.text(x, y, str(v), ha="center", va="center", fontsize=10, fontweight="bold", color="white")
    ax.legend(wedges, [f"{SEV[k][0]} ({cont[k]})" for k in chaves], loc="upper center",
              bbox_to_anchor=(0.5, -0.02), ncol=3, frameon=False, fontsize=8, handlelength=1, columnspacing=1)
    ax.set_title("Achados por severidade", fontsize=11, fontweight="bold", color="#111827", pad=6)
    ax.set_aspect("equal")
    return fig


def grafico_barras(achados, fortes):
    cats = list(A.CATEGORIAS.keys())
    nomes = [f"{c}. {A.CATEGORIAS[c]}" if c <= 5 else A.CATEGORIAS[c] for c in cats]
    fig, ax = plt.subplots(figsize=(5.6, 3.9))
    altura = 0.36
    y_ach = [i - altura / 2 - 0.02 for i in range(len(cats))]
    y_forte = [i + altura / 2 + 0.02 for i in range(len(cats))]
    esquerda = [0] * len(cats)
    for sev in ORDEM_SEV:
        vals = [sum(1 for a in achados if a["cat"] == c and a["sev"] == sev) for c in cats]
        if not any(vals):
            continue
        ax.barh(y_ach, vals, left=esquerda, height=altura, color=SEV[sev][1],
                edgecolor="white", linewidth=1.5, label=SEV[sev][0])
        esquerda = [e + v for e, v in zip(esquerda, vals)]
    for y, tot in zip(y_ach, esquerda):
        if tot:
            ax.text(tot + 0.12, y, str(tot), va="center", fontsize=8, color="#374151")
    f_vals = [sum(1 for f in fortes if f[0] == c) for c in cats]
    ax.barh(y_forte, f_vals, height=altura, color=VERDE, edgecolor="white", linewidth=1.5, label="Ponto forte")
    for y, v in zip(y_forte, f_vals):
        if v:
            ax.text(v + 0.12, y, str(v), va="center", fontsize=8, color="#374151")
    ax.set_yticks(range(len(cats)))
    ax.set_yticklabels(nomes, fontsize=8.5, color="#111827")
    ax.invert_yaxis()
    ax.set_xlim(0, max(esquerda + f_vals) + 1)
    ax.xaxis.set_major_locator(matplotlib.ticker.MaxNLocator(integer=True))
    ax.tick_params(axis="x", labelsize=8, colors="#6B7280")
    ax.tick_params(axis="y", length=0)
    ax.grid(axis="x", color="#E5E7EB", linewidth=0.7)
    ax.set_axisbelow(True)
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color("#D1D5DB")
    ax.legend(loc="upper center", bbox_to_anchor=(0.42, -0.1), ncol=6, frameon=False, fontsize=7.5,
              handlelength=1, columnspacing=0.9)
    ax.set_title("Achados e pontos fortes por categoria", fontsize=11, fontweight="bold", color="#111827", pad=6)
    return fig


# ----------------------------------------------------------------------------- Página
class CanvasNumerado(rl_canvas.Canvas):
    """Adia o desenho do rodapé para saber o total de páginas."""

    def __init__(self, *a, **k):
        super().__init__(*a, **k)
        self._paginas = []

    def showPage(self):
        self._paginas.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._paginas)
        for estado in self._paginas:
            self.__dict__.update(estado)
            self._decorar(total)
            super().showPage()
        super().save()

    def _decorar(self, total):
        n = self._pageNumber
        self.saveState()
        if n > 1:
            self.setFont("DV", 7.5)
            self.setFillColor(MUTED)
            self.drawString(MARGEM, PAGE_H - 1.25 * cm, TITULO_RELATORIO)
            self.drawRightString(PAGE_W - MARGEM, PAGE_H - 1.25 * cm, A.DATA)
            self.setStrokeColor(LINHA)
            self.setLineWidth(0.6)
            self.line(MARGEM, PAGE_H - 1.42 * cm, PAGE_W - MARGEM, PAGE_H - 1.42 * cm)
        self.setStrokeColor(LINHA)
        self.line(MARGEM, 1.45 * cm, PAGE_W - MARGEM, 1.45 * cm)
        self.setFont("DV", 7.5)
        self.setFillColor(MUTED)
        self.drawString(MARGEM, 1.05 * cm, TITULO_RELATORIO)
        self.drawRightString(PAGE_W - MARGEM, 1.05 * cm, f"Página {n} de {total}")
        self.restoreState()


def capa_fundo(c, _doc):
    c.saveState()
    c.setFillColor(MARCA)
    c.rect(0, PAGE_H - 1.1 * cm, PAGE_W, 1.1 * cm, stroke=0, fill=1)
    x = MARGEM
    for k in ORDEM_SEV[:4] + ["forte"]:
        cor = SEV[k][1] if k in SEV else VERDE
        c.setFillColor(colors.HexColor(cor))
        c.rect(x, PAGE_H - 1.1 * cm - 4, 2.2 * cm, 4, stroke=0, fill=1)
        x += 2.2 * cm
    c.restoreState()


# ----------------------------------------------------------------------------- Conteúdo
def capa(story, cont):
    story.append(Spacer(1, 1.3 * cm))
    story.append(P("AUDITORIA DE SEGURANÇA · CÓDIGO-FONTE", "muted"))
    story.append(Spacer(1, 4))
    story.append(P(f"Relatório de Auditoria de Segurança — {A.PROJETO}", "cover_t"))
    story.append(Spacer(1, 6))
    story.append(P(SUBTITULO, "cover_s"))
    story.append(Spacer(1, 14))
    meta = [
        [P("<b>Data</b>", "cell"), P(A.DATA, "cell")],
        [P("<b>Repositório</b>", "cell"), P(A.REPO, "cell")],
        [P("<b>Resultado</b>", "cell"),
         P(f"{sum(cont.values())} achados: " + ", ".join(f"{cont[k]} {SEV[k][0].lower()}" for k in ORDEM_SEV if cont.get(k))
           + f"; {len(A.PONTOS_FORTES)} pontos fortes", "cell")],
    ]
    t = Table(meta, colWidths=[3.6 * cm, LARGURA - 3.6 * cm])
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.4, LINHA), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    story.append(t)

    story.append(P("Escopo auditado", "h2"))
    for e in A.ESCOPO:
        story.append(P("• " + escape(e), "body"))
    story.append(P("Stack detectada", "h2"))
    story.append(tabela([[P("Camada", "th"), P("Detectado", "th")]] +
                        [[P(f"<b>{escape(a)}</b>", "cell"), P(escape(b), "cell")] for a, b in A.STACK],
                        [4.2 * cm, LARGURA - 4.2 * cm]))

    story.append(P("Nota metodológica: como cada categoria foi mapeada para a stack", "h2"))
    story.append(tabela([[P("Categoria", "th"), P("Equivalente nesta stack e como foi verificado", "th")]] +
                        [[P(f"<b>{escape(a)}</b>", "cell"), P(escape(b), "cell")] for a, b in A.METODOLOGIA],
                        [4.2 * cm, LARGURA - 4.2 * cm]))
    story.append(Spacer(1, 6))
    story.append(P(NOTA_METODOLOGIA, "muted"))


def resumo(story, cont):
    story.append(P("Resumo executivo", "h1"))
    story.append(P(RESUMO))
    story.append(Spacer(1, 8))
    tiles = []
    for k in ORDEM_SEV:
        rot, cor = SEV[k]
        tiles.append([Paragraph(f'<font color="{cor}">{cont.get(k, 0)}</font>', S["kpi_n"]), P(rot, "kpi_l")])
    tiles.append([Paragraph(f'<font color="{VERDE}">{len(A.PONTOS_FORTES)}</font>', S["kpi_n"]), P("Pontos fortes", "kpi_l")])
    w = LARGURA / 6
    t = Table([[x[0] for x in tiles], [x[1] for x in tiles]], colWidths=[w] * 6)
    st = [("BOX", (i, 0), (i, 1), 0.6, LINHA) for i in range(6)]
    st += [("LINEABOVE", (i, 0), (i, 0), 3, colors.HexColor(SEV[k][1] if k in SEV else VERDE))
           for i, k in enumerate(ORDEM_SEV + ["forte"])]
    st += [("TOPPADDING", (0, 0), (-1, 0), 8), ("BOTTOMPADDING", (0, 1), (-1, 1), 8),
           ("BACKGROUND", (0, 0), (-1, -1), FUNDO)]
    t.setStyle(TableStyle(st))
    story.append(t)
    story.append(Spacer(1, 10))
    g = Table([[fig_para_image(grafico_rosca(cont), 6.3), fig_para_image(grafico_barras(A.ACHADOS, A.PONTOS_FORTES), 10.4)]],
              colWidths=[6.6 * cm, LARGURA - 6.6 * cm])
    g.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
    story.append(g)
    story.append(Spacer(1, 6))
    # tabela equivalente aos gráficos
    cats = list(A.CATEGORIAS.keys())
    cab = [P("Categoria", "th")] + [P(SEV[k][0], "th") for k in ORDEM_SEV] + [P("Total", "th"), P("Fortes", "th")]
    linhas = [cab]
    for c in cats:
        vals = [sum(1 for a in A.ACHADOS if a["cat"] == c and a["sev"] == k) for k in ORDEM_SEV]
        nome = f"{c}. {A.CATEGORIAS[c]}" if c <= 5 else "Adicionais (fora das 5)"
        linhas.append([P(nome, "cell")] + [P(str(v) if v else "–", "cell") for v in vals] +
                      [P(f"<b>{sum(vals)}</b>", "cell"), P(str(sum(1 for f in A.PONTOS_FORTES if f[0] == c) or "–"), "cell")])
    story.append(tabela(linhas, [4.6 * cm] + [1.45 * cm] * 4 + [2.3 * cm, 1.3 * cm, 1.8 * cm]))


def fortes_fracos(story):
    story.append(PageBreak())
    story.append(P("Pontos fortes", "h1"))
    story.append(P(INTRO_FORTES, "muted"))
    story.append(Spacer(1, 4))
    linhas = [[P("", "th"), P("Categoria", "th"), P("Controle e evidência", "th")]]
    for cat, titulo, ev in A.PONTOS_FORTES:
        linhas.append([chip("forte", 2.0 * cm), P(A.CATEGORIAS[cat], "cell"),
                       P(f"<b>{escape(titulo)}.</b> {escape(ev)}", "cell")])
    story.append(tabela(linhas, [2.2 * cm, 3.2 * cm, LARGURA - 5.4 * cm], cor_cab=colors.HexColor(VERDE)))

    story.append(Spacer(1, 12))
    story.append(P("Pontos fracos: os riscos centrais", "h1"))
    linhas = [[P("", "th"), P("Risco", "th"), P("Por que importa", "th")]]
    for sev, t, d in RISCOS:
        linhas.append([chip(sev), P(f"<b>{escape(t)}</b>", "cell"), P(escape(d), "cell")])
    story.append(tabela(linhas, [2.2 * cm, 4.4 * cm, LARGURA - 6.6 * cm], cor_cab=colors.HexColor(SEV["critica"][1])))
    story.append(Spacer(1, 6))
    story.append(P(CADEIA, "body"))


def achados_por_categoria():
    """(cat, título da seção, achados ordenados por severidade) para cada categoria."""
    ordem = {k: i for i, k in enumerate(ORDEM_SEV)}
    for cat, nome in A.CATEGORIAS.items():
        itens = sorted([a for a in A.ACHADOS if a["cat"] == cat], key=lambda a: ordem[a["sev"]])
        titulo = f"{cat}. {nome}" if cat <= 5 else "Achados adicionais (fora das cinco categorias)"
        yield cat, titulo, itens


def detalhados(story):
    story.append(PageBreak())
    story.append(P("Achados detalhados por categoria", "h1"))
    story.append(P(INTRO_DETALHADOS, "muted"))
    for cat, titulo, itens in achados_por_categoria():
        story.append(CondPageBreak(4 * cm))
        story.append(P(titulo, "h2"))
        if not itens:
            story.append(P("Nenhum achado.", "body"))
            continue
        linhas = [[P("Severidade", "th"), P("Arquivo:linha", "th"), P("Descrição", "th")]]
        for a in itens:
            locais = "<br/>".join(escape(encurta(l)) for l in a["locais"])
            desc = [P(f"<b>{a['id']} · {escape(a['titulo'])}</b>", "cellb"), Spacer(1, 2),
                    P(escape(a["desc"]), "cell"), code(a["trecho"]),
                    P(f"<b>Explorabilidade:</b> {escape(a['explor'])}", "cell")]
            linhas.append([chip(a["sev"]), Paragraph(locais, S["path"]), desc])
        story.append(tabela(linhas, [2.2 * cm, 5.3 * cm, LARGURA - 7.5 * cm]))


def recomendacoes(story):
    story.append(PageBreak())
    story.append(P("Recomendações priorizadas", "h1"))
    cores = {"P1": SEV["critica"][1], "P2": SEV["alta"][1], "P3": SEV["baixa"][1]}
    for pr, prazo, itens in A.RECOMENDACOES:
        cab = Table([[Paragraph(pr, S["chip"]), P(f"<b>{prazo}</b>", "cellb")]], colWidths=[1.2 * cm, LARGURA - 1.2 * cm])
        cab.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), colors.HexColor(cores[pr])),
                                 ("ROUNDEDCORNERS", [4, 4, 4, 4]), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                                 ("LEFTPADDING", (1, 0), (1, 0), 8)]))
        bloco = [Spacer(1, 6), cab, Spacer(1, 3)]
        for i, it in enumerate(itens, 1):
            bloco.append(P(f"{i}. {escape(it)}", "body"))
        story.append(KeepTogether(bloco))
    story.append(Spacer(1, 8))
    story.append(P(NOTA_P2, "muted"))


def quebra_md(texto, largura=104):
    """Quebra linhas longas do Markdown mantendo a indentação de itens de lista."""
    saida, em_codigo = [], False
    for linha in texto.splitlines():
        if linha.strip().startswith("```"):
            em_codigo = not em_codigo
            saida.append(linha)
            continue
        if len(linha) <= largura:
            saida.append(linha)
            continue
        if em_codigo:
            saida.extend(textwrap.wrap(linha, largura, break_long_words=True, drop_whitespace=False) or [""])
            continue
        m = re.match(r"^(\s*(?:[-*] \[ \] |[-*] |\d+\. )?)", linha)
        recuo = " " * len(m.group(1)) if m else ""
        saida.extend(textwrap.wrap(linha, largura, subsequent_indent=recuo, break_long_words=True,
                                   break_on_hyphens=False))
    return "\n".join(saida)


def sev_issue(iss):
    return MAPA_SEV_LABEL[iss["labels"][1].split(":")[1]]


def texto_issue(i, iss):
    return (f"--- ISSUE {i} ---\n# {iss['titulo']}\n\nLabels: {', '.join(iss['labels'])}\n\n"
            f"{iss['corpo'].strip()}\n--- FIM ISSUE {i} ---")


def issues(story):
    story.append(PageBreak())
    story.append(P("ISSUES PARA O GITHUB", "h1"))
    story.append(P(INTRO_ISSUES + NOTA_ISSUES_PDF, "body"))
    for i, iss in enumerate(A.ISSUES, 1):
        texto = texto_issue(i, iss)
        cab = Table([[chip(sev_issue(iss)), P(f"<b>Issue {i}</b> · {escape(iss['titulo'])}", "cellb")]],
                    colWidths=[2.2 * cm, LARGURA - 2.2 * cm])
        cab.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (0, 0), 0)]))
        story.append(CondPageBreak(5 * cm))
        story.append(Spacer(1, 10))
        story.append(cab)
        story.append(Spacer(1, 8))
        story.append(XPreformatted(escape(quebra_md(texto)), S["issue"]))


# ----------------------------------------------------------------------------- Markdown
def md(texto):
    """Escapa texto para Markdown, convertendo a marcação do ReportLab (<b>) em negrito."""
    def esc(t):
        return re.sub(r"([\\`*_\[\]])", r"\\\1", t).replace("<", "&lt;")
    return "**".join(esc(parte) for parte in re.split(r"</?b>", texto))


def md_celula(texto):
    return str(texto).replace("|", "\\|").replace("\n", "<br>")


def md_tabela(cabecalho, linhas):
    saida = ["| " + " | ".join(cabecalho) + " |", "|" + "---|" * len(cabecalho)]
    saida += ["| " + " | ".join(md_celula(c) for c in linha) + " |" for linha in linhas]
    return "\n".join(saida)


def md_cerca(texto, lang=""):
    """Bloco de código com cerca maior que qualquer sequência de crases do conteúdo."""
    maior = max((len(m) for m in re.findall(r"`+", texto)), default=0)
    cerca = "`" * max(3, maior + 1)
    return f"{cerca}{lang}\n{texto}\n{cerca}"


def gerar_markdown(cont):
    L = []
    add = L.append

    # Capa
    add(f"# {md(TITULO_RELATORIO)}\n")
    add(f"*{md(SUBTITULO)}*\n")
    resultado = (f"{sum(cont.values())} achados: "
                 + ", ".join(f"{cont[k]} {SEV[k][0].lower()}" for k in ORDEM_SEV if cont.get(k))
                 + f"; {len(A.PONTOS_FORTES)} pontos fortes")
    add(md_tabela(["", ""], [[md(f"<b>{a}</b>"), md(b)] for a, b in [
        ("Data", A.DATA), ("Repositório", A.REPO), ("Resultado", resultado)]]) + "\n")
    add("## Escopo auditado\n")
    add("\n".join(f"- {md(e)}" for e in A.ESCOPO) + "\n")
    add("## Stack detectada\n")
    add(md_tabela(["Camada", "Detectado"], [[md(f"<b>{a}</b>"), md(b)] for a, b in A.STACK]) + "\n")
    add("## Nota metodológica: como cada categoria foi mapeada para a stack\n")
    add(md_tabela(["Categoria", "Equivalente nesta stack e como foi verificado"],
                  [[md(f"<b>{a}</b>"), md(b)] for a, b in A.METODOLOGIA]) + "\n")
    add(f"> {md(NOTA_METODOLOGIA)}\n")

    # Resumo executivo
    add("## Resumo executivo\n")
    add(md(RESUMO) + "\n")
    add(md_tabela([SEV[k][0] for k in ORDEM_SEV] + ["Pontos fortes"],
                  [[cont.get(k, 0) for k in ORDEM_SEV] + [len(A.PONTOS_FORTES)]]) + "\n")
    linhas = []
    for c in A.CATEGORIAS:
        vals = [sum(1 for a in A.ACHADOS if a["cat"] == c and a["sev"] == k) for k in ORDEM_SEV]
        nome = f"{c}. {A.CATEGORIAS[c]}" if c <= 5 else "Adicionais (fora das 5)"
        fortes = sum(1 for f in A.PONTOS_FORTES if f[0] == c)
        linhas.append([md(nome)] + [v or "–" for v in vals] + [f"**{sum(vals)}**", fortes or "–"])
    add(md_tabela(["Categoria"] + [SEV[k][0] for k in ORDEM_SEV] + ["Total", "Fortes"], linhas) + "\n")

    # Pontos fortes e fracos
    add("## Pontos fortes\n")
    add(f"*{md(INTRO_FORTES)}*\n")
    add(md_tabela(["Categoria", "Controle e evidência"],
                  [[md(A.CATEGORIAS[cat]), md(f"<b>{titulo}.</b> {ev}")]
                   for cat, titulo, ev in A.PONTOS_FORTES]) + "\n")
    add("## Pontos fracos: os riscos centrais\n")
    add(md_tabela(["Severidade", "Risco", "Por que importa"],
                  [[SEV[sev][0], md(f"<b>{t}</b>"), md(d)] for sev, t, d in RISCOS]) + "\n")
    add(md(CADEIA) + "\n")

    # Achados detalhados
    add("## Achados detalhados por categoria\n")
    add(f"*{md(INTRO_DETALHADOS)}*\n")
    for _cat, titulo, itens in achados_por_categoria():
        add(f"### {md(titulo)}\n")
        if not itens:
            add("Nenhum achado.\n")
            continue
        for a in itens:
            add(f"#### {md(a['id'])} · {md(a['titulo'])}\n")
            add(f"**Severidade:** {SEV[a['sev']][0]}\n")
            add("**Arquivo:linha:**\n")
            add("\n".join(f"- `{l}`" for l in a["locais"]) + "\n")
            add(md(a["desc"]) + "\n")
            add(md_cerca(a["trecho"]) + "\n")
            add(f"**Explorabilidade:** {md(a['explor'])}\n")

    # Recomendações
    add("## Recomendações priorizadas\n")
    for pr, prazo, itens in A.RECOMENDACOES:
        add(f"### {pr} · {md(prazo)}\n")
        add("\n".join(f"{i}. {md(it)}" for i, it in enumerate(itens, 1)) + "\n")
    add(f"> {md(NOTA_P2)}\n")

    # Issues
    add("## Issues para o GitHub\n")
    add(md(INTRO_ISSUES) + "\n")
    for i, iss in enumerate(A.ISSUES, 1):
        add(f"### Issue {i} · {md(iss['titulo'])}\n")
        add(f"**Severidade:** {SEV[sev_issue(iss)][0]}\n")
        add(md_cerca(texto_issue(i, iss), "markdown") + "\n")

    with open(SAIDA_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(L))
    print(f"Markdown gerado: {SAIDA_MD}")


def main():
    cont = Counter(a["sev"] for a in A.ACHADOS)
    doc = BaseDocTemplate(SAIDA, pagesize=A4, leftMargin=MARGEM, rightMargin=MARGEM, topMargin=MARGEM,
                          bottomMargin=MARGEM, title=TITULO_RELATORIO, author="Auditoria de segurança",
                          subject="Auditoria de segurança do código-fonte", lang="pt-BR")
    frame = Frame(MARGEM, MARGEM, LARGURA, PAGE_H - 2 * MARGEM, id="f", leftPadding=0, rightPadding=0,
                  topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="capa", frames=[frame], onPage=capa_fundo),
                          PageTemplate(id="normal", frames=[frame])])
    story = [NextPageTemplate("normal")]
    capa(story, cont)
    story.append(PageBreak())
    resumo(story, cont)
    fortes_fracos(story)
    detalhados(story)
    recomendacoes(story)
    issues(story)
    doc.build(story, canvasmaker=CanvasNumerado)
    print(f"PDF gerado: {SAIDA}")
    gerar_markdown(cont)


if __name__ == "__main__":
    main()
