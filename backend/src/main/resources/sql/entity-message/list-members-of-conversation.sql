-- Participantes de uma conversa. Membros do projeto vêm do próprio projeto (origin PROJECT);
-- os gravados em conversation_member são pessoas do evento (origin EVENT) ou, numa DIRECT, as duas
-- pessoas (origin NULL).
SELECT
    a.id as id_account,
    a.first_name || ' ' || a.last_name as member_name,
    'PROJECT' as member_origin,
    par.membership_label
FROM conversation c
INNER JOIN project_account_relationship par ON par.id_project = c.id_project
INNER JOIN account a ON a.id = par.id_account
WHERE c.id = :id_conversation AND c.type IN ('PROJECT', 'PROJECT_EVENT')
UNION
SELECT
    a.id as id_account,
    a.first_name || ' ' || a.last_name as member_name,
    CASE WHEN c.type = 'DIRECT' THEN NULL ELSE 'EVENT' END as member_origin,
    COALESCE(ear.membership_label, '') as membership_label
FROM conversation c
INNER JOIN conversation_member cm ON cm.id_conversation = c.id
INNER JOIN account a ON a.id = cm.id_account
LEFT JOIN event_account_relationship ear ON ear.id_event = c.id_event AND ear.id_account = cm.id_account
WHERE c.id = :id_conversation
ORDER BY member_origin NULLS FIRST, member_name
