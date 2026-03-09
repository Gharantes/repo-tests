with
    is_member as (
        SELECT id_project FROM project_members pm
        WHERE pm.id_account = :id_account
        LIMIT 1
    )
SELECT
    p.id,
    p.title,
    p.description,
    p.created_by,
    a.login as created_by_name,
    at.url as url_banner,
    CASE
        WHEN p.created_by = :id_account THEN true
        WHEN im.id_project IS NOT NULL THEN true
        ELSE FALSE END AS user_is_member
FROM project p
INNER JOIN account a ON p.created_by = a.id
LEFT JOIN attachments at ON
    p.id_banner = at.id AND
    at.attachment_type = 0
LEFT JOIN is_member im ON im.id_project = p.id
WHERE
    p.id_tenant = :id_tenant