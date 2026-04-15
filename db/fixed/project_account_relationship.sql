CREATE TABLE project_account_relationship (
    id serial4 primary key unique not null,
    id_project bigint REFERENCES project not null,
    id_account bigint REFERENCES account not null
);

alter table project_account_relationship
add column membership_label varchar(255) not null;