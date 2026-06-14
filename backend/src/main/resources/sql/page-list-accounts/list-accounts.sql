SELECT
    a.id as id_account,
    a.id_tenant,
    a.login as account_login,
    a.email as account_email,
    a.first_name as account_first_name,
    a.last_name as account_last_name
FROM account a
WHERE a.id_tenant = :id_tenant
    AND (:text IS NULL OR a.login ILIKE :text OR a.first_name ILIKE :text OR a.last_name ILIKE :text)