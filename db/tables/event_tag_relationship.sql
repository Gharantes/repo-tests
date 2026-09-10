CREATE TABLE event_tag_relationship (
    id serial4 primary key unique not null,
    id_event bigint references event not null,
    id_tag bigint references tags not null
);

ALTER TABLE event_tag_relationship
ADD CONSTRAINT uk_event_tag_relationship_id_event_id_tag UNIQUE (id_event, id_tag);
