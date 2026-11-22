-- Conversas que :id_account enxerga, a mais movimentada primeiro.
-- PROJECT e PROJECT_EVENT: todo membro do projeto vê. PROJECT_EVENT e DIRECT: quem está em
-- conversation_member também vê. Uma DIRECT ainda sem mensagem só aparece para quem a abriu.
-- Se :id_conversation vier preenchido, devolve só aquela conversa (mesmas regras de visibilidade).
WITH visible AS (
    SELECT c.id
    FROM conversation c
    INNER JOIN project_account_relationship par ON par.id_project = c.id_project AND par.id_account = :id_account
    WHERE c.type IN ('PROJECT', 'PROJECT_EVENT')
    UNION
    SELECT cm.id_conversation
    FROM conversation_member cm
    WHERE cm.id_account = :id_account
)
SELECT
    c.id as id_conversation,
    c.type as conversation_type,
    c.id_project,
    p.title as project_title,
    c.id_event,
    e.title as event_title,
    other.id as id_other_account,
    other.first_name || ' ' || other.last_name as other_account_name,
    lm.content as last_message_content,
    la.first_name || ' ' || la.last_name as last_message_author_name,
    lm.created_at as last_message_at,
    unread.n as unread_count,
    c.created_at as conversation_created_at
FROM conversation c
INNER JOIN visible v ON v.id = c.id
LEFT JOIN project p ON p.id = c.id_project
LEFT JOIN event e ON e.id = c.id_event
LEFT JOIN LATERAL (
    SELECT a.id, a.first_name, a.last_name
    FROM conversation_member cm
    INNER JOIN account a ON a.id = cm.id_account
    WHERE c.type = 'DIRECT' AND cm.id_conversation = c.id AND cm.id_account <> :id_account
    LIMIT 1
) other ON TRUE
LEFT JOIN LATERAL (
    SELECT m.content, m.created_at, m.id_account
    FROM conversation_message m
    WHERE m.id_conversation = c.id
    ORDER BY m.id DESC
    LIMIT 1
) lm ON TRUE
LEFT JOIN account la ON la.id = lm.id_account
LEFT JOIN conversation_read cr ON cr.id_conversation = c.id AND cr.id_account = :id_account
LEFT JOIN LATERAL (
    SELECT COUNT(*)::int as n
    FROM conversation_message m
    WHERE m.id_conversation = c.id
      AND m.id > COALESCE(cr.last_read_message_id, 0)
      AND m.id_account <> :id_account
) unread ON TRUE
WHERE
    (c.type <> 'DIRECT' OR lm.created_at IS NOT NULL OR c.id_account_creator = :id_account)
    AND (CAST(:id_conversation AS bigint) IS NULL OR c.id = :id_conversation)
ORDER BY COALESCE(lm.created_at, c.created_at) DESC, c.id DESC
