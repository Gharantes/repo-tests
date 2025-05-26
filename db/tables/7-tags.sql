create table tags (
	id serial4 primary key,
	id_tenant bigint references tenant not null,
	name varchar(255) not null,
	created_at timestamp not null default now()
);


alter table tags add constraint unique_tag_by_tenant unique (id_tenant, name);