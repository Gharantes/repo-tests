SELECT
    e.id as id_event,
    e.title as event_title,
    e.description as event_description,
    e.id_tenant
    a.id as id_account,
    a.login as account_login,
    a.email as account_email,
    a.first_name as account_first_name,
    a.last_name as account_last_name
FROM event e
INNER JOIN account a ON e.id_account_owner = a.id
wHERE e.id = :id_event;