CREATE TABLE meetup (
    id serial4 primary key ,
    id_event bigint references event not null,
    id_local bigint references local,
    in_person boolean not null,
    dt_event date not null
);

ALTER TABLE meetup ADD COLUMN id_tenant bigint not null references TENANT;
-- DROP TABLE meetup;