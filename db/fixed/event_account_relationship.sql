CREATE TABLE event_account_relationship (
    id serial4 primary key unique not null,
    id_event bigint REFERENCES event not null,
    id_account bigint REFERENCES account not null
);

alter table event_account_relationship
add column membership_label varchar(255) not null;