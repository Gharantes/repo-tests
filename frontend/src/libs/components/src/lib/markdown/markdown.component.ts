import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { Marked, Renderer, Tokens } from 'marked';

/**
 * Markdown no estilo do Obsidian: títulos, **negrito**, _itálico_, ~~riscado~~, `código`,
 * citações, listas (inclusive de tarefas), tabelas, [links](url) e ![imagens](url).
 * Quebra de linha simples vira quebra de linha, como no Obsidian.
 */
const md = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    link(token: Tokens.Link) {
      return Renderer.prototype.link.call(this, token).replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ');
    },
    // O sanitizador do Angular remove <input>, então a caixa da lista de tarefas vira um símbolo.
    checkbox({ checked }: Tokens.Checkbox) {
      return `<span class="task${checked ? ' done' : ''}">${checked ? '☑' : '☐'}</span>`;
    },
  },
});

/**
 * Mostra um texto Markdown. O HTML gerado passa pelo sanitizador do Angular ([innerHTML]),
 * que tira scripts, handlers e URLs perigosas de quem escreveu HTML cru.
 */
@Component({
  selector: 'lib-markdown',
  standalone: true,
  template: `<div class="lib-markdown" [innerHTML]="html()"></div>`,
  styles: `
    .lib-markdown { font-size: 15px; line-height: 1.65; color: #33312c; overflow-wrap: anywhere; }
    .lib-markdown > :first-child { margin-top: 0; }
    .lib-markdown > :last-child { margin-bottom: 0; }
    .lib-markdown p, .lib-markdown ul, .lib-markdown ol, .lib-markdown blockquote, .lib-markdown pre, .lib-markdown table { margin: 0 0 10px; }
    .lib-markdown h1, .lib-markdown h2, .lib-markdown h3, .lib-markdown h4, .lib-markdown h5, .lib-markdown h6 {
      margin: 14px 0 6px; line-height: 1.3; color: #121840; }
    .lib-markdown h1 { font-size: 1.6em; font-weight: 700; }
    .lib-markdown h2 { font-size: 1.35em; font-weight: 700; }
    .lib-markdown h3 { font-size: 1.2em; font-weight: 600; }
    .lib-markdown h4, .lib-markdown h5, .lib-markdown h6 { font-size: 1.05em; font-weight: 600; }
    .lib-markdown a { color: #3B52CC; }
    .lib-markdown ul, .lib-markdown ol { padding-left: 22px; }
    .lib-markdown li:has(> .task), .lib-markdown li:has(> p > .task) { list-style: none; margin-left: -18px; }
    .lib-markdown .task { color: #9a978f; }
    .lib-markdown .task.done { color: #3B52CC; }
    .lib-markdown blockquote { padding-left: 12px; border-left: 3px solid #3B52CC; color: #6b6860; }
    .lib-markdown code { font-family: monospace; font-size: .9em; background: #0000000d; border-radius: 3px; padding: 1px 4px; }
    .lib-markdown pre { background: #f6f5f2; border-radius: 6px; padding: 10px 12px; overflow-x: auto; }
    .lib-markdown pre code { background: none; padding: 0; }
    .lib-markdown hr { border: 0; border-top: 1px solid #e8e4dc; margin: 14px 0; }
    .lib-markdown img { display: block; max-width: 100%; max-height: 480px; border-radius: 6px; margin: 6px 0; }
    .lib-markdown table { border-collapse: collapse; display: block; overflow-x: auto; }
    .lib-markdown th, .lib-markdown td { border: 1px solid #e8e4dc; padding: 4px 10px; text-align: left; }
  `,
  // Sem encapsulamento: o HTML vem de [innerHTML], fora do escopo de estilos do componente.
  // As regras ficam todas presas em .lib-markdown.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MarkdownComponent {
  public readonly source = input<string>('');
  public readonly html = computed(() => md.parse(this.source() ?? '', { async: false }) as string);
}
