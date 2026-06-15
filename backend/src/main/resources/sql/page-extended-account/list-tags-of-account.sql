SELECT
    t.id as id_tag,
    t.title as tag_title,
    t.id_tenant,
    t.created_at as tag_created_at,
    t.for_projects as tag_for_projects,
    t.for_events as tag_for_events,
    t.for_accounts as tag_for_accounts
FROM account_tag_relationship atr
INNER JOIN tags t ON atr.id_tag = t.id
WHERE atr.id_account = :id_account
