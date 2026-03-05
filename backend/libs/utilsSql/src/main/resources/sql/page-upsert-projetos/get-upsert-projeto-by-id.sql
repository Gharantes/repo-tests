SELECT
    p.id_tenant,
    p.title,
    p.description,
    p.created_by,
    a.url as url_banner
FROM project p
LEFT JOIN attachments a ON a.id = p.id_banner
WHERE p.id = :id