-- Permissões efetivas: as concedidas direto na conta somadas às dos perfis dela.
SELECT
    p.id,
    p.label AS name,
    p.description,
    p.category
FROM permission p
WHERE p.id IN (
    SELECT apr.id_permission
    FROM account_permission_relationship apr
    WHERE apr.id_account = :id_account
    UNION
    SELECT ppr.id_permission
    FROM account_permission_profile_relationship aprof
    INNER JOIN permission_profile_permission_relationship ppr ON ppr.id_profile = aprof.id_profile
    WHERE aprof.id_account = :id_account
)
ORDER BY p.category, p.id
