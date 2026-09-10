-- Schema consolidado do Synergia, na ordem de execução.
-- Substitui os DDLs que antes estavam espalhados em db/fixed e db/tables.

-- ============================================================
-- 1. Tabelas sem dependências
-- ============================================================

CREATE TABLE TENANT (
    id serial4 unique primary key not null,
    identifier VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_private BOOLEAN NOT NULL
);

ALTER TABLE TENANT
ADD CONSTRAINT uk_tenant_identifier UNIQUE (identifier);

CREATE TABLE permission (
    id serial4 primary key unique not null,
    label VARCHAR(255) NOT NULL
);

-- ============================================================
-- 2. Entidades
-- ============================================================

CREATE TABLE account (
    id serial4 unique primary key not null,
    id_tenant BIGINT REFERENCES tenant NOT NULL,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE account ADD COLUMN email VARCHAR(255);

ALTER TABLE account
ADD CONSTRAINT uk_account_login_id_tenant UNIQUE (login, id_tenant);

CREATE TABLE event (
    id serial4 unique primary key not null,
    id_tenant BIGINT REFERENCES tenant NOT NULL,
    ---
    title VARCHAR(255) NOT NUll,
    description TEXT NOT NULL,
    banner_url VARCHAR(255),
    banner_color VARCHAR(7) NOT NULL
);

CREATE TABLE project (
    id serial4 unique primary key not null,
    id_tenant BIGINT REFERENCES tenant NOT NULL,
    ---
    title VARCHAR(255) NOT NUll,
    description TEXT NOT NULL,
    banner_url VARCHAR(255),
    banner_color VARCHAR(7) NOT NULL
);

create table tags (
    id serial4 primary key unique not null,
    id_tenant bigint not null REFERENCES TENANT,
    title VARCHAR(255) not null
);

ALTER TABLE tags
ADD CONSTRAINT uk_tags__id_tenant_title UNIQUE (id_tenant, title);

alter table tags add column for_projects BOOLEAN not null default false;
alter table tags add column for_events BOOLEAN not null default false;
alter table tags add column for_accounts BOOLEAN not null default false;

ALTER TABLE tags ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE TABLE post (
    id serial4 unique primary key not null,
    id_account bigint REFERENCES account not null,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
);

-- ============================================================
-- 3. Relacionamentos
-- ============================================================

CREATE TABLE event_account_relationship (
    id serial4 primary key unique not null,
    id_event bigint REFERENCES event not null,
    id_account bigint REFERENCES account not null
);

alter table event_account_relationship
add column membership_label varchar(255) not null;

CREATE TABLE project_account_relationship (
    id serial4 primary key unique not null,
    id_project bigint REFERENCES project not null,
    id_account bigint REFERENCES account not null
);

alter table project_account_relationship
add column membership_label varchar(255) not null;

CREATE TABLE event_tag_relationship (
    id serial4 primary key unique not null,
    id_event bigint references event not null,
    id_tag bigint references tags not null
);

ALTER TABLE event_tag_relationship
ADD CONSTRAINT uk_event_tag_relationship_id_event_id_tag UNIQUE (id_event, id_tag);

CREATE TABLE project_tag_relationship (
    id serial4 primary key unique not null,
    id_project bigint references project not null,
    id_tag bigint references tags not null
);

ALTER TABLE project_tag_relationship
ADD CONSTRAINT uk_project_tag_relationship_id_project_id_tag UNIQUE (id_project, id_tag);

CREATE TABLE project_event_relationship (
    id serial4 primary key unique not null,
    id_project bigint references project not null,
    id_event bigint references event not null
);

ALTER TABLE project_event_relationship
ADD CONSTRAINT uk_project_event_relationship_id_project_id_event UNIQUE (id_project, id_event);

CREATE TABLE account_tag_relationship (
    id serial4 primary key unique not null,
    id_account bigint references account not null,
    id_tag bigint references tags not null
);

ALTER TABLE account_tag_relationship
ADD CONSTRAINT uk_account_tag_relationship_id_account_id_tag UNIQUE (id_account, id_tag);

CREATE TABLE event_post_relationship (
    id serial4 primary key unique not null,
    id_event bigint references event not null,
    id_post bigint references post not null
);

ALTER TABLE event_post_relationship
ADD CONSTRAINT uk_event_post_relationship_id_event_id_post UNIQUE (id_event, id_post);
