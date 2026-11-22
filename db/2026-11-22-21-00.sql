-- Tipo DATE nas notificações (data marcada no calendário). O Hibernate não atualiza o CHECK que
-- ele mesmo criou com os tipos antigos; a aplicação recria este CHECK na subida
-- (NotificationTypeConstraintSync). O script serve para bancos montados à mão.
ALTER TABLE notification DROP CONSTRAINT IF EXISTS notification_type_check;
ALTER TABLE notification ADD CONSTRAINT notification_type_check CHECK (type IN ('POST', 'NOTE', 'LIST', 'DATE'));
