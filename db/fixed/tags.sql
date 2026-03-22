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