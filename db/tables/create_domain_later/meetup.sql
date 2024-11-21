CREATE TABLE meetup (
    id serial4 primary key ,
    id_event bigint references event not null,
    id_date_ref bigint references date_ref not null,
    id_local bigint references local,
    in_person boolean not null
);

DROP TABLE meetup;