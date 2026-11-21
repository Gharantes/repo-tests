-- Projetos registrados em eventos. Bancos criados pelo Hibernate não tinham esta tabela
-- (não havia entidade JPA para ela); em bancos criados pelo script inicial ela já existe.
CREATE TABLE IF NOT EXISTS project_event_relationship (
    id serial4 primary key unique not null,
    id_project bigint references project not null,
    id_event bigint references event not null,
    CONSTRAINT uk_project_event_relationship_id_project_id_event UNIQUE (id_project, id_event)
);
