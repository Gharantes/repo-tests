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
    id_tenant = :id_tenant
    AND (:text IS NULL OR title ILIKE :text)
    AND (:for_projects IS FALSE OR for_projects IS TRUE)
    AND (:for_events IS FALSE OR for_events IS TRUE)
    AND (:for_accounts IS FALSE OR for_accounts IS TRUE)
