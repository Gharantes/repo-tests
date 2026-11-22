-- Mensagens de uma conversa, da mais nova para a mais antiga (o serviço inverte).
-- :after_id traz só as novas (releitura periódica); :before_id pagina para trás.
SELECT
    m.id as id_message,
    m.id_conversation,
    m.id_account,
    COALESCE(a.first_name || ' ' || a.last_name, 'Usuário removido') as message_author_name,
    m.content as message_content,
    m.created_at as message_created_at
FROM conversation_message m
LEFT JOIN account a ON a.id = m.id_account
WHERE
    m.id_conversation = :id_conversation
    AND (CAST(:after_id AS bigint) IS NULL OR m.id > :after_id)
    AND (CAST(:before_id AS bigint) IS NULL OR m.id < :before_id)
ORDER BY m.id DESC
LIMIT :limit
