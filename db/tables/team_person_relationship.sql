CREATE TABLE PERSON_ACCOUNT_RELATIONSHIP (
    id_person bigint references person not null,
    id_account bigint references account not null
);