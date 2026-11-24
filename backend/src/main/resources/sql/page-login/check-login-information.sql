-- Busca a conta pelo login; a senha é conferida no Kotlin (PageLoginSqlService),
-- porque no banco só fica o hash bcrypt e o SQL não sabe conferir bcrypt.
SELECT
    a.id,
    t.id as id_tenant,
    t.title as tenant_title,
    a.login,
    a.first_name,
    a.last_name,
    a.password
FROM account a
INNER JOIN tenant t on a.id_tenant = t.id
WHERE
    a.id_tenant = :id_tenant AND
    a.login = :login
