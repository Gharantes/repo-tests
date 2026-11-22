SELECT
    n.id as id_notification,
    n.type as notification_type,
    n.parent_entity as notification_parent_entity,
    n.parent_id as notification_parent_id,
    COALESCE(e.title, p.title, '') as notification_parent_title,
    n.reference_id as notification_reference_id,
    COALESCE(po.title, nt.title, ce.title, '') as notification_reference_title,
    a.first_name || ' ' || a.last_name as notification_actor_name,
    n.created_at as notification_created_at,
    n.read_at as notification_read_at
FROM notification n
INNER JOIN account a ON a.id = n.id_actor
LEFT JOIN event e ON n.parent_entity = 'EVENT' AND e.id = n.parent_id
LEFT JOIN project p ON n.parent_entity = 'PROJECT' AND p.id = n.parent_id
LEFT JOIN post po ON n.type = 'POST' AND po.id = n.reference_id
LEFT JOIN note nt ON n.type IN ('NOTE', 'LIST') AND nt.id = n.reference_id
LEFT JOIN calendar_entry ce ON n.type = 'DATE' AND ce.id = n.reference_id
WHERE n.id_account = :id_account
ORDER BY n.created_at DESC, n.id DESC
LIMIT :limit
