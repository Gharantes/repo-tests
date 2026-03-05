CREATE TABLE event_members (
    id serial4 primary key unique not null,
    id_event bigint references event not null,
    id_account bigint references account not null
);


-- uk_event_members_id_event_id_account",
            -- columnNames = ["id_event", "id_account"]