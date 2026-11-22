SELECT
    p.id,
    p.label AS name,
    p.description,
    p.category
FROM permission p
WHERE
    :text IS NULL OR
    p.label ILIKE '%' || :text || '%' OR
    p.description ILIKE '%' || :text || '%' OR
    p.category ILIKE '%' || :text || '%'
ORDER BY p.category, p.id
