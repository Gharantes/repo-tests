INSERT INTO account (
    id_tenant,
    created_at,
    updated_at,
    login,
    password
) VALUES (
    :id_tenant,
    now(),
    now(),
    'ADMIN',
    :password
);