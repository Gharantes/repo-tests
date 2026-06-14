SELECT
    a.id as id_account,
    a.id_tenant,
    a.login as account_login,
    a.email as account_email,
    a.first_name as account_first_name,
    a.last_name as account_last_name
FROM account a
INNER JOIN project_account_relationship par ON par.id_account = a.id
WHERE par.id_project = :id_project
