CREATE TABLE project_event_relationship (
    id_project bigint references project not null,
    id_event bigint references event not null
);
