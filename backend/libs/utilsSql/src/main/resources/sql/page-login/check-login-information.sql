SELECT
    a.id,
    a.login,
    p.first_name,
    p.last_name,
    p.id as id_person,
    t.id as id_tenant,
    t.title as tenant_title
FROM account a
INNER JOIN tenant t on
    a.id_tenant = t.id
LEFT JOIN person p ON
    a.id_tenant = p.id_tenant AND
    a.id = p.id_account
WHERE
    a.id_tenant = :id_tenant AND
    a.login = :login AND
    CASE
        WHEN :check_last_seen THEN (
            a.last_seen is NOT NULL AND
            ((now() - a.last_seen) < interval '12 hours')
        )
        ELSE a.password = :password END