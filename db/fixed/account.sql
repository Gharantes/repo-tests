CREATE TABLE account (
    id serial4 unique primary key not null,
    id_tenant BIGINT REFERENCES tenant NOT NULL,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE account ADD COLUMN email VARCHAR(255);

ALTER TABLE account
ADD CONSTRAINT uk_account_login UNIQUE (login);