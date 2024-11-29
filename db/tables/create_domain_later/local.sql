CREATE TABLE LOCAL (
    id serial4 primary key,
    id_city bigint references city,
    bairro varchar(255),
    rua varchar(255),
    num_endereco int,
    complemento varchar(255)
);
ALTER TABLE LOCAL ADD COLUMN id_tenant BIGINT REFERENCES tenant;