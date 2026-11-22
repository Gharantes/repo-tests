-- Avisa os membros do projeto, menos o próprio autor. Só grava se o autor for Líder do projeto.
INSERT INTO notification (id_tenant, id_account, id_actor, type, parent_entity, parent_id, reference_id, created_at)
SELECT p.id_tenant, par.id_account, :id_actor, :type, 'PROJECT', p.id, :reference_id, :now
FROM project p
INNER JOIN project_account_relationship par ON par.id_project = p.id
WHERE p.id = :id_project
    AND par.id_account <> :id_actor
    AND EXISTS (
        SELECT 1
        FROM project_account_relationship ld
        WHERE ld.id_project = :id_project
            AND ld.id_account = :id_actor
            AND ld.membership_label = :lead_label
    )
