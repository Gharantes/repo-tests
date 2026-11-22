-- Aba "Calendário" de projetos e eventos: datas com título e descrição marcadas pelos membros.
-- Cada data pertence a um só projeto ou evento (parent_entity + parent_id). As datas de um evento
-- também aparecem nos projetos registrados nele. O Hibernate cria esta tabela sozinho
-- (ddl-auto: update); o script serve para bancos montados à mão.
CREATE TABLE IF NOT EXISTS calendar_entry (
    id bigserial primary key unique not null,
    id_tenant bigint not null,
    id_account bigint not null,
    parent_entity varchar(10) not null,
    parent_id bigint not null,
    date date not null,
    title varchar(255) not null,
    description text not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);
CREATE INDEX IF NOT EXISTS ix_calendar_entry_parent ON calendar_entry (parent_entity, parent_id, date);
