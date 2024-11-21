CREATE TABLE state (
    id serial4 primary key,
    id_country bigint references COUNTRY,
    acronym varchar(2) not null,
    name varchar(255) not null
);
drop table estado;
