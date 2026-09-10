CREATE TABLE project_tag_relationship (
    id serial4 primary key unique not null,
    id_project bigint references project not null,
    id_tag bigint references tags not null
);

ALTER TABLE project_tag_relationship
ADD CONSTRAINT uk_project_tag_relationship_id_project_id_tag UNIQUE (id_project, id_tag);
