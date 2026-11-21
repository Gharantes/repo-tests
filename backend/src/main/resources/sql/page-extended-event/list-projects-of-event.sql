SELECT
    p.id as id_project,
    p.id_tenant,
    p.title as project_title,
    p.description as project_description,
    p.banner_url as project_banner_url,
    p.banner_color as project_banner_color
FROM project_event_relationship per
INNER JOIN project p ON p.id = per.id_project
WHERE
    per.id_event = :id_event
    AND (:text IS NULL OR p.title ILIKE :text)
ORDER BY p.title
