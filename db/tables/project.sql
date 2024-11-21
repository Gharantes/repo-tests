CREATE TABLE project (
    id serial4 primary key ,
    id_tenant bigint references tenant not null,
    title varchar(255) not null,
    description text not null
);
