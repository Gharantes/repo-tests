-- Lousa: blocos de anotação, opcionalmente ligados a um projeto ou a um evento.
CREATE TABLE note (
    id serial4 unique primary key not null,
    id_tenant BIGINT REFERENCES tenant NOT NULL,
    id_account BIGINT REFERENCES account NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('TEXT', 'LIST')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    items TEXT NOT NULL,
    color VARCHAR(20) NOT NULL,
    pinned BOOLEAN NOT NULL,
    archived_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE project_note_relationship (
    id serial4 primary key unique not null,
    id_project bigint references project not null,
    id_note bigint references note not null
);

ALTER TABLE project_note_relationship
ADD CONSTRAINT uk_project_note_relationship_id_note UNIQUE (id_note);

CREATE TABLE event_note_relationship (
    id serial4 primary key unique not null,
    id_event bigint references event not null,
    id_note bigint references note not null
);

ALTER TABLE event_note_relationship
ADD CONSTRAINT uk_event_note_relationship_id_note UNIQUE (id_note);
