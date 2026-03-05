CREATE TABLE TENANT (
    id bigint unique primary key not null,
    identifier VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL
);

CREATE CONSTRAINT unique identifier 