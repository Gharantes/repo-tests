SELECT
id as id_account,
id_tenant,
login as account_login,
email as account_email,
first_name as account_first_name,
last_name as account_last_name,
FROM account
WHERE
    id_tenant = :id_tenant
    AND (login = :login OR email = :email)