-- Tela Mensagens: grupo do projeto, conversas privadas e grupo projeto + evento.
-- Membros do projeto não são gravados em conversation_member: vêm de project_account_relationship.
-- O Hibernate cria estas tabelas sozinho (ddl-auto: update); o script serve para bancos montados à mão.
CREATE TABLE IF NOT EXISTS conversation (
    id bigserial primary key unique not null,
    id_tenant bigint not null,
    type varchar(20) not null CHECK (type IN ('PROJECT', 'PROJECT_EVENT', 'DIRECT')),
    id_project bigint,
    id_event bigint,
    unique_key varchar(100) not null,
    id_account_creator bigint not null,
    created_at timestamp not null default now(),
    CONSTRAINT uq_conversation_unique_key UNIQUE (unique_key)
);
CREATE TABLE IF NOT EXISTS conversation_member (
    id bigserial primary key unique not null,
    id_conversation bigint not null,
    id_account bigint not null,
    id_account_added_by bigint not null,
    created_at timestamp not null default now(),
    CONSTRAINT uq_conversation_member UNIQUE (id_conversation, id_account)
);
CREATE TABLE IF NOT EXISTS conversation_read (
    id bigserial primary key unique not null,
    id_conversation bigint not null,
    id_account bigint not null,
    last_read_message_id bigint not null,
    CONSTRAINT uq_conversation_read UNIQUE (id_conversation, id_account)
);
CREATE TABLE IF NOT EXISTS conversation_message (
    id bigserial primary key unique not null,
    id_conversation bigint not null,
    id_account bigint not null,
    content text not null,
    created_at timestamp not null default now()
);
CREATE INDEX IF NOT EXISTS ix_conversation_message_conversation ON conversation_message (id_conversation, id);
