CREATE TABLE event (
    id serial4 unique primary key not null,
    id_tenant BIGINT REFERENCES tenant NOT NULL,
    id_account__owner REFERENCES account NOT NULL,
    -- id_banner BIGINT REFERENCES attachments

    title VARCHAR(255) NOT NUll,
    description TEXT NOT NULL
);
