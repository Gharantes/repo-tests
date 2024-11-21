DROP TABLE usuario;

CREATE TABLE account (
    id serial4 primary key,
    id_tenant bigint references tenant,
    login varchar(255) not null,
    password varchar(255) not null
)