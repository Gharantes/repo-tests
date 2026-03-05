SELECT * FROM tags
WHERE
    id_tenant = :id_tenant AND
    (:text IS NULL OR name ILIKE :text)