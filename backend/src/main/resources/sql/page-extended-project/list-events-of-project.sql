SELECT
    e.id as id_event,
    e.id_tenant,
    e.title as event_title,
    e.description as event_description,
    e.banner_url as event_banner_url,
    e.banner_color as event_banner_color
FROM project_event_relationship per
INNER JOIN event e ON e.id = per.id_event
WHERE per.id_project = :id_project
ORDER BY e.title
