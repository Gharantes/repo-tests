SELECT
    t.id as id_tag,
    t.title as tag_title,
    t.id_tenant,
    t.created_at as tag_created_at,
    t.for_projects as tag_for_projects,
    t.for_events as tag_for_events,
    t.for_accounts as tag_for_accounts
FROM project_tag_relationship ptr
INNER JOIN tags t ON ptr.id_tag = t.id
WHERE ptr.id_project = :id_project