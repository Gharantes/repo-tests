CREATE TABLE event_members (
    id serial4 primary key unique not null,
    id_event bigint references event not null,
    id_account bigint references account not null
);

