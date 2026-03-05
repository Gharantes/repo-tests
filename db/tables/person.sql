CREATE TABLE meetup (
    id serial4 unique primary key not null,
    id_tenant BIGINT references TENANT not null,
    id_account BIGINT references ACCOUNT,
    first_name VARCHAR(255) not null,
    last_name VARCHAR(255)
);

CREATE CONSTRAINT UNIQUE id_account