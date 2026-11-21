-- post.content foi criado pelo Hibernate como VARCHAR(255) em bancos antigos (o ddl-auto
-- não muda o tipo de coluna existente). Postagens em Markdown passam fácil disso.
ALTER TABLE post ALTER COLUMN content TYPE TEXT;
