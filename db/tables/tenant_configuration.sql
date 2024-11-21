DROP TABLE tenant_configuration;
CREATE TABLE tenant_configuration (
    id serial4 primary key,
    id_tenant bigint references tenant,
    login_bg_hex varchar(8),
    login_bg_url text,
    login_dark_mode boolean not null
);


ALTER TABLE tenant_configuration
ADD CONSTRAINT tenant_configuration_unique_by_tenant UNIQUE (id_tenant);