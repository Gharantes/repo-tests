SELECT
    n.id as id_note,
    n.id_account,
    a.first_name || ' ' || a.last_name as note_author_name,
    n.type as note_type,
    n.title as note_title,
    n.content as note_content,
    n.items as note_items,
    n.color as note_color,
    n.pinned as note_pinned,
    n.archived_at as note_archived_at,
    n.updated_at as note_updated_at,
    CASE
        WHEN pnr.id IS NOT NULL THEN 'PROJECT'
        WHEN enr.id IS NOT NULL THEN 'EVENT'
    END as note_parent_entity,
    COALESCE(pnr.id_project, enr.id_event) as note_parent_id,
    COALESCE(p.title, e.title) as note_parent_title
FROM note n
INNER JOIN account a ON a.id = n.id_account
LEFT JOIN project_note_relationship pnr ON pnr.id_note = n.id
LEFT JOIN project p ON p.id = pnr.id_project
LEFT JOIN event_note_relationship enr ON enr.id_note = n.id
LEFT JOIN event e ON e.id = enr.id_event
WHERE
    (:id_account IS NULL OR n.id_account = :id_account)
    AND (:id_project IS NULL OR pnr.id_project = :id_project)
    AND (:id_event IS NULL OR enr.id_event = :id_event)
    AND (:include_archived OR n.archived_at IS NULL)
ORDER BY n.pinned DESC, n.updated_at DESC
