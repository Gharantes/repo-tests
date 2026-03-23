SELECT
    e.id as id_event,
    e.title as event_title,
    e.description as event_description
FROM project_event_relationship per
INNER JOIN event e ON e.id = per.id_event
WHERE per.id_project = :id_project