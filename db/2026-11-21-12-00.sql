-- Feed do evento: postagens passam a guardar quando foram criadas e editadas.
ALTER TABLE post ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE post ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Uma postagem pertence a um único evento.
ALTER TABLE event_post_relationship
ADD CONSTRAINT uk_event_post_relationship_id_post UNIQUE (id_post);
