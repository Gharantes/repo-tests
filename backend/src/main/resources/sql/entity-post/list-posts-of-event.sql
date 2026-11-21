SELECT
    p.id as id_post,
    p.id_account,
    a.first_name || ' ' || a.last_name as post_author_name,
    p.title as post_title,
    p.content as post_content,
    p.created_at as post_created_at,
    p.updated_at as post_updated_at
FROM post p
INNER JOIN account a ON a.id = p.id_account
INNER JOIN event_post_relationship epr ON epr.id_post = p.id
WHERE epr.id_event = :id_event
ORDER BY p.created_at DESC, p.id DESC
