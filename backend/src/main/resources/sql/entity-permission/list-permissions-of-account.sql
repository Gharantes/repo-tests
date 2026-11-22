SELECT
    p.id,
    p.label AS name,
    p.description,
    p.category
FROM account_permission_relationship apr
INNER JOIN permission p ON p.id = apr.id_permission
WHERE apr.id_account = :id_account
ORDER BY p.category, p.id
