CREATE TABLE tenant (
    id serial4 primary key,
    name varchar(255) not null,
    owner varchar(255) not null,
    identifier varchar(255) not null
);

ALTER TABLE tenant
ADD CONSTRAINT tenant_unique_identifier UNIQUE (identifier);