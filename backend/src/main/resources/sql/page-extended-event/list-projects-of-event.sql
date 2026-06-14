SELECT
    p.id,
    p.title,
    p.description
FROM event e
INNER JOIN project_event_relationship per ON
    e.id = per.id_event
INNER JOIN project p ON
    per.id_project = p.id
WHERE
    e.id_tenant = :id_tenant AND
    e.id = :id_event