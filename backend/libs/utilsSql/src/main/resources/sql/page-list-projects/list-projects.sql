SELECT
    p.id as id_project,
    p.id_tenant,
    p.title as project_title,
    p.description as project_description,
    p.banner_url as project_banner_url,
    p.banner_color as project_banner_color
FROM project p
WHERE
    p.id_tenant = :id_tenant
    AND (:text IS NULL OR p.title ILIKE :text)