SELECT
    t.id as id_tag,
    t.name as tag_name
FROM project_tag_relationship ptr
INNER JOIN tags t ON ptr.id_tag = t.id
WHERE ptr.id_project = :id_project