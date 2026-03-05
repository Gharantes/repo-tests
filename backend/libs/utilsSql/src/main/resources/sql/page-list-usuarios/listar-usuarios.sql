SELECT
    a.id,
    a.login,
    p.id as id_person,
    p.first_name,
    p.last_name
FROM account a
LEFT JOIN person p ON
    a.id_tenant = p.id_tenant AND
    a.id = p.id_account
WHERE a.id_tenant = :id_tenant