CREATE TABLE project_members (
    id serial4 primary key unique not null,
    id_project bigint references project not null,
    id_account bigint references account not null
);

ALTER TABLE project_members
ADD CONSTRAINT uk_project_members_id_project_id_account UNIQUE (id_project, id_account);
