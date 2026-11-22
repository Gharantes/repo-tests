-- Data marcada no calendário. Qualquer membro que marca avisa; o autor nunca recebe o próprio aviso.
-- Data de projeto: avisa os membros do projeto.
-- Data de evento: avisa os membros dos projetos registrados no evento (cada pessoa uma vez só).
INSERT INTO notification (id_tenant, id_account, id_actor, type, parent_entity, parent_id, reference_id, created_at)
SELECT ce.id_tenant, audience.id_account, :id_actor, :type, ce.parent_entity, ce.parent_id, ce.id, :now
FROM calendar_entry ce
INNER JOIN (
    SELECT par.id_account
    FROM project_account_relationship par
    WHERE :parent_entity = 'PROJECT' AND par.id_project = :parent_id
    UNION
    SELECT par.id_account
    FROM project_event_relationship per
    INNER JOIN project_account_relationship par ON par.id_project = per.id_project
    WHERE :parent_entity = 'EVENT' AND per.id_event = :parent_id
) audience ON TRUE
WHERE ce.id = :reference_id
    AND audience.id_account <> :id_actor
