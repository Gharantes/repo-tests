SELECT
    e.id as id_event,
    e.id_tenant,
    e.title as event_title,
    e.description as event_description
FROM event e
wHERE
    e.id_tenant = :id_tenant
    AND (:text IS NULL OR e.title ILIKE :text)