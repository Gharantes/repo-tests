CREATE TABLE CITY (
    id serial4 primary key,
    id_state bigint REFERENCES state,
    name varchar(255) not null
);
