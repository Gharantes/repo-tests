-- Sino do topo: avisos de postagens, notas e listas publicadas pelo Organizador do evento ou pelo
-- Líder do projeto. O Hibernate cria esta tabela sozinho (ddl-auto: update); o script serve para
-- bancos montados à mão.
CREATE TABLE IF NOT EXISTS notification (
    id bigserial primary key unique not null,
    id_tenant bigint not null,
    id_account bigint not null,
    id_actor bigint not null,
    type varchar(10) not null,
    parent_entity varchar(10) not null,
    parent_id bigint not null,
    reference_id bigint not null,
    created_at timestamp not null default now(),
    read_at timestamp
);
CREATE INDEX IF NOT EXISTS ix_notification_id_account ON notification (id_account, created_at);
