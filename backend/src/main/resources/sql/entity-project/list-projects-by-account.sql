SELECT
    p.id as id_project,
    p.id_tenant,
    p.title as project_title,
    p.description as project_description,
    p.banner_url as project_banner_url,
    p.banner_color as project_banner_color
FROM project_account_relationship par
INNER JOIN project p ON par.id_project = p.id
WHERE
    par.id_account = :id_account
    AND (:text IS NULL OR p.title ILIKE :text)