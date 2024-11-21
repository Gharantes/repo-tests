CREATE TABLE person (
    id serial4 primary key ,
    id_tenant bigint REFERENCES tenant not null ,
    id_account bigint references account,
    first_name varchar(255) not null ,
    last_name varchar(255) not null,
    birthday date not null
);;
