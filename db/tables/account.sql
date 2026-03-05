CREATE TABLE account (
    id serial4 unique primary key not null,
    id_tenant BIGINT REFERENCES tenant NOT NULL,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
);

CREATE CONSTRAINT 
UNIQUE 
ID_tenant Login