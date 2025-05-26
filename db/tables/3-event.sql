CREATE TABLE event (
    id serial4 primary key,
    id_tenant bigint references tenant not null,
    title varchar(255) not null,
    description TEXT not null
);

ALTER TABLE event add column created_by bigint REFERENCES account not null;
ALTER TABLE event add column id_banner bigint references attachments;