SELECT
    id as id_tag,
    id_tenant,
    title as tag_title,
    created_at as tag_created_at,
    for_projects as tag_for_projects,
    for_events as tag_for_events,
    for_accounts as tag_for_accounts
FROM tags
WHERE
    id_tenant = :id_tenant AND
    (:text IS NULL OR title ILIKE :text)