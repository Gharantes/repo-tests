with
    is_member as (
        SELECT id_event FROM event_members em
        WHERE em.id_account = :id_account
        LIMIT 1
    )
SELECT
    e.id,
    e.title,
    e.description,
    e.created_by,
    a.login as created_by_name,
    at.url as url_banner,
    CASE
        WHEN e.created_by = :id_account THEN true
        WHEN im.id_event IS NOT NULL THEN true
        ELSE FALSE END AS user_is_member
FROM event e
INNER JOIN account a ON
    e.created_by = a.id
LEFT JOIN attachments at ON
    e.id_banner = at.id AND
    at.attachment_type = 0
LEFT JOIN is_member im ON im.id_event = e.id
wHERE
    e.id_tenant = :id_tenant
    AND (:text IS NULL OR e.title ILIKE :text)