/** Postagem do feed. `content` é Markdown. */
export interface IPostModel {
  id: number;
  idAccount: number;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/** O que o diálogo de postagem devolve. */
export interface IPostDraft {
  title: string;
  content: string;
}
