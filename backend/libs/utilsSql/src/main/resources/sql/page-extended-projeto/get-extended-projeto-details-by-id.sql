        SELECT
            p.id,
            p.title,
            p.description,
            a.url
        FROM project p
        LEFT JOIN attachments a ON
            p.id_tenant = a.id_tenant AND
            p.id_banner = a.id
        WHERE p.id = :id