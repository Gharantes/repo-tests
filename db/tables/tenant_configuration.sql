CREATE TABLE tenant_configuration (
    id serial4 primary key,
    id_tenant bigint references tenant,
    login_bg_hex varchar(8),
    login_bg_url text,
    login_text_hex varchar(8)
);