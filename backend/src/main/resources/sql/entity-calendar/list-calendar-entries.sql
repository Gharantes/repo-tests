-- Datas de um evento (:id_event) ou de um projeto (:id_project). No projeto vêm também as datas
-- dos eventos em que ele está registrado; as do projeto nunca aparecem no evento.
SELECT
    ce.id as id_calendar_entry,
    ce.id_account,
    a.first_name || ' ' || a.last_name as calendar_entry_author_name,
    ce.date as calendar_entry_date,
    ce.title as calendar_entry_title,
    ce.description as calendar_entry_description,
    ce.parent_entity as calendar_entry_parent_entity,
    ce.parent_id as calendar_entry_parent_id,
    COALESCE(p.title, e.title) as calendar_entry_parent_title,
    ce.updated_at as calendar_entry_updated_at
FROM calendar_entry ce
INNER JOIN account a ON a.id = ce.id_account
LEFT JOIN project p ON ce.parent_entity = 'PROJECT' AND p.id = ce.parent_id
LEFT JOIN event e ON ce.parent_entity = 'EVENT' AND e.id = ce.parent_id
WHERE
    (ce.parent_entity = 'EVENT' AND ce.parent_id = :id_event)
    OR (ce.parent_entity = 'PROJECT' AND ce.parent_id = :id_project)
    OR (ce.parent_entity = 'EVENT' AND ce.parent_id IN (
        SELECT per.id_event
        FROM project_event_relationship per
        WHERE per.id_project = :id_project
    ))
ORDER BY ce.date, ce.title, ce.id
