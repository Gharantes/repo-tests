CREATE TABLE event (
    id serial4 unique primary key not null,
    id_tenant BIGINT REFERENCES tenant NOT NULL,
    ---
    title VARCHAR(255) NOT NUll,
    description TEXT NOT NULL,
    banner_url VARCHAR(255),
    banner_color VARCHAR(7) NOT NULL
);
