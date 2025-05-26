create table attachments (
	id serial4 primary key,
	url text not null,
	attachment_type integer not null
);

alter table attachments add column id_tenant bigint references tenant not null;