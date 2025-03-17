SELECT * FROM tenant;
INSERT INTO tenant (
    name,
    owner,
    identifier
) values (
    'TESTE',
    'OWNER',
    'TESTING'
);


SELECT * FROM tenant_configuration;
INSERT INTO tenant_configuration (
    id_tenant,
    login_bg_hex,
    login_bg_url,
    login_dark_mode
) VALUES (
    1,
    null,
    'https://images.pexels.com/photos/28711474/pexels-photo-28711474/free-photo-of-starry-night-sky-capturing-the-milky-way.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    true,
)