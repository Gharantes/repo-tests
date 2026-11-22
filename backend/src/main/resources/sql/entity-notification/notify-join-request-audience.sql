-- Pedido para participar de um projeto: avisa todos os membros do projeto (qualquer um pode
-- responder). reference_id é o id do pedido em project_join_request.
INSERT INTO notification (id_tenant, id_account, id_actor, type, parent_entity, parent_id, reference_id, created_at)
SELECT p.id_tenant, par.id_account, :id_actor, :type, 'PROJECT', p.id, :reference_id, :now
FROM project p
INNER JOIN project_account_relationship par ON par.id_project = p.id
WHERE p.id = :id_project
    AND par.id_account <> :id_actor
