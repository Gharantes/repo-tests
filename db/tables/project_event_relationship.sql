CREATE TABLE project_event_relationship (
    id serial4 primary key unique not null,
    id_project bigint references project not null,
    id_event bigint references event not null
);

ALTER TABLE project_event_relationship
ADD CONSTRAINT uk_project_event_relationship_id_project_id_event UNIQUE (id_project, id_event);
