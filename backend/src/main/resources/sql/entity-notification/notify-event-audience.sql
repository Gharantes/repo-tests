-- Avisa quem participa do evento (membros do evento e membros dos projetos registrados nele),
-- menos o próprio autor. Só grava se o autor for líder (Organizador) do evento.
INSERT INTO notification (id_tenant, id_account, id_actor, type, parent_entity, parent_id, reference_id, created_at)
SELECT e.id_tenant, audience.id_account, :id_actor, :type, 'EVENT', e.id, :reference_id, :now
FROM event e
INNER JOIN (
    SELECT ear.id_account
    FROM event_account_relationship ear
    WHERE ear.id_event = :id_event
    UNION
    SELECT par.id_account
    FROM project_event_relationship per
    INNER JOIN project_account_relationship par ON par.id_project = per.id_project
    WHERE per.id_event = :id_event
) audience ON TRUE
WHERE e.id = :id_event
    AND audience.id_account <> :id_actor
    AND EXISTS (
        SELECT 1
        FROM event_account_relationship ld
        WHERE ld.id_event = :id_event
            AND ld.id_account = :id_actor
            AND ld.membership_label = :lead_label
    )
