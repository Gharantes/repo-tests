-- Pedido para participar com apresentação: a mensagem de quem pede vai para o grupo do projeto.
-- join_request_status preenchido = mensagem de futuro membro (PENDING, ACCEPTED, DECLINED).
-- O Hibernate cria as colunas sozinho (ddl-auto: update); o script serve para bancos montados à mão.
ALTER TABLE conversation_message ADD COLUMN IF NOT EXISTS id_join_request bigint;
ALTER TABLE conversation_message ADD COLUMN IF NOT EXISTS join_request_status varchar(10)
    CHECK (join_request_status IN ('PENDING', 'ACCEPTED', 'DECLINED'));
CREATE INDEX IF NOT EXISTS ix_conversation_message_join_request ON conversation_message (id_join_request);
