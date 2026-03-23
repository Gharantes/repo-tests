SELECT
    t.id,
    t.name
FROM event_tag_relationship ptr
INNER JOIN tags t ON ptr.id_tag = t.id
WHERE ptr.id_event = :id_event