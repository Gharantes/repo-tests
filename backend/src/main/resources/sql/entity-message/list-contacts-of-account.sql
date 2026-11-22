-- Com quem :id_account pode abrir uma conversa privada:
--  1. colegas dos projetos dele;
--  2. membros dos eventos em que os projetos dele estão registrados;
--  3. (sendo ele de um evento) membros dos projetos registrados nesse evento.
SELECT
    a.id as id_account,
    a.first_name || ' ' || a.last_name as contact_name,
    'PROJECT' as contact_relation,
    p.id as contact_parent_id,
    p.title as contact_parent_title,
    other.membership_label
FROM project_account_relationship mine
INNER JOIN project_account_relationship other ON other.id_project = mine.id_project AND other.id_account <> :id_account
INNER JOIN account a ON a.id = other.id_account
INNER JOIN project p ON p.id = mine.id_project
WHERE mine.id_account = :id_account
UNION
SELECT
    a.id as id_account,
    a.first_name || ' ' || a.last_name as contact_name,
    'EVENT' as contact_relation,
    e.id as contact_parent_id,
    e.title as contact_parent_title,
    ear.membership_label
FROM project_account_relationship mine
INNER JOIN project_event_relationship per ON per.id_project = mine.id_project
INNER JOIN event_account_relationship ear ON ear.id_event = per.id_event AND ear.id_account <> :id_account
INNER JOIN account a ON a.id = ear.id_account
INNER JOIN event e ON e.id = per.id_event
WHERE mine.id_account = :id_account
UNION
SELECT
    a.id as id_account,
    a.first_name || ' ' || a.last_name as contact_name,
    'PROJECT' as contact_relation,
    p.id as contact_parent_id,
    p.title as contact_parent_title,
    par.membership_label
FROM event_account_relationship mine
INNER JOIN project_event_relationship per ON per.id_event = mine.id_event
INNER JOIN project_account_relationship par ON par.id_project = per.id_project AND par.id_account <> :id_account
INNER JOIN account a ON a.id = par.id_account
INNER JOIN project p ON p.id = per.id_project
WHERE mine.id_account = :id_account
ORDER BY contact_name, contact_parent_title
