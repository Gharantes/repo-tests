-- Pedido para participar de um projeto (card do projeto em Explorar). A linha só existe enquanto o
-- pedido está pendente. Notificações novas: REQUEST (para os membros) e ACCEPTED (para quem pediu).
-- O Hibernate cria a tabela e a aplicação recria o CHECK na subida (NotificationTypeConstraintSync);
-- o script serve para bancos montados à mão.
CREATE TABLE IF NOT EXISTS project_join_request (
    id bigserial primary key unique not null,
    id_tenant bigint not null,
    id_project bigint not null,
    id_account bigint not null,
    created_at timestamp not null default now(),
    CONSTRAINT uq_project_join_request UNIQUE (id_project, id_account)
);
ALTER TABLE notification DROP CONSTRAINT IF EXISTS notification_type_check;
ALTER TABLE notification ADD CONSTRAINT notification_type_check
    CHECK (type IN ('POST', 'NOTE', 'LIST', 'DATE', 'REQUEST', 'ACCEPTED'));
