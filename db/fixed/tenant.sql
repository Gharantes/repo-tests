CREATE TABLE TENANT (
    id serial4 unique primary key not null,
    identifier VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_private BOOLEAN NOT NULL
);

ALTER TABLE TENANT
ADD CONSTRAINT uk_tenant_identifier UNIQUE (identifier);