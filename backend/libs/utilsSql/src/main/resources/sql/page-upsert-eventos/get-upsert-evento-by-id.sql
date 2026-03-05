SELECT
    e.id_tenant,
    e.title,
    e.description,
    e.created_by AS created_by,
    a.url AS url_banner
FROM event e
LEFT JOIN attachments a ON a.id = e.id_banner
WHERE e.id = :id