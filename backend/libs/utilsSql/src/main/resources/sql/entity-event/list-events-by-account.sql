SELECT
    e.id as id_event,
    e.id_tenant,
    e.title as event_title,
    e.description as event_description,
    e.banner_url as event_banner_url,
    e.banner_color as event_banner_color
FROM event_account_relationship ear
INNER JOIN event e ON eam.id_event = e.id
wHERE
    ear.id_account = :id_account
    AND (:text IS NULL OR e.title ILIKE :text)