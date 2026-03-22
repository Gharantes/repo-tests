INSERT INTO account (
    id_tenant,
    login,
    email,
    password,
    first_name,
    last_name
) VALUES (
    :id_tenant,
    :login,
    :email,
    :password,
    :first_name,
    :last_name
);