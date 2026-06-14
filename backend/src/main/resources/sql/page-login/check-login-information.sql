SELECT
    a.id,
    t.id as id_tenant,
    t.title as tenant_title,
    a.login,
    a.first_name,
    a.last_name
FROM account a
INNER JOIN tenant t on a.id_tenant = t.id
WHERE
    a.id_tenant = :id_tenant AND
    a.login = :login AND
    CASE
        WHEN :check_last_seen THEN (
            a.last_seen is NOT NULL AND
            ((now() - a.last_seen) < interval '12 hours')
        )
        ELSE a.password = :password END