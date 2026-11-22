-- Feed do dashboard: postagens e blocos da lousa (não arquivados) dos eventos e projetos de que a
-- conta participa, do mais novo para o mais antigo. Participar de um evento é ser membro dele ou
-- de um projeto registrado nele.
WITH my_events AS (
    SELECT ear.id_event
    FROM event_account_relationship ear
    WHERE ear.id_account = :id_account
    UNION
    SELECT per.id_event
    FROM project_account_relationship par
    INNER JOIN project_event_relationship per ON per.id_project = par.id_project
    WHERE par.id_account = :id_account
),
my_projects AS (
    SELECT par.id_project
    FROM project_account_relationship par
    WHERE par.id_account = :id_account
),
feed AS (
    SELECT
        'POST' as feed_type,
        po.id as feed_reference_id,
        'EVENT' as feed_parent_entity,
        e.id as feed_parent_id,
        e.title as feed_parent_title,
        po.id_account,
        po.title as feed_title,
        po.content as feed_content,
        '[]' as feed_items,
        po.created_at as feed_created_at
    FROM my_events me
    INNER JOIN event e ON e.id = me.id_event
    INNER JOIN event_post_relationship epr ON epr.id_event = e.id
    INNER JOIN post po ON po.id = epr.id_post

    UNION ALL

    SELECT
        CASE WHEN nt.type = 'LIST' THEN 'LIST' ELSE 'NOTE' END,
        nt.id,
        'EVENT',
        e.id,
        e.title,
        nt.id_account,
        nt.title,
        nt.content,
        nt.items,
        nt.created_at
    FROM my_events me
    INNER JOIN event e ON e.id = me.id_event
    INNER JOIN event_note_relationship enr ON enr.id_event = e.id
    INNER JOIN note nt ON nt.id = enr.id_note
    WHERE nt.archived_at IS NULL

    UNION ALL

    SELECT
        CASE WHEN nt.type = 'LIST' THEN 'LIST' ELSE 'NOTE' END,
        nt.id,
        'PROJECT',
        p.id,
        p.title,
        nt.id_account,
        nt.title,
        nt.content,
        nt.items,
        nt.created_at
    FROM my_projects mp
    INNER JOIN project p ON p.id = mp.id_project
    INNER JOIN project_note_relationship pnr ON pnr.id_project = p.id
    INNER JOIN note nt ON nt.id = pnr.id_note
    WHERE nt.archived_at IS NULL
)
SELECT
    f.*,
    a.first_name || ' ' || a.last_name as feed_author_name,
    CASE
        WHEN f.feed_parent_entity = 'EVENT' THEN EXISTS (
            SELECT 1 FROM event_account_relationship ld
            WHERE ld.id_event = f.feed_parent_id
                AND ld.id_account = f.id_account
                AND ld.membership_label = :event_lead_label
        )
        ELSE EXISTS (
            SELECT 1 FROM project_account_relationship ld
            WHERE ld.id_project = f.feed_parent_id
                AND ld.id_account = f.id_account
                AND ld.membership_label = :project_lead_label
        )
    END as feed_author_is_lead
FROM feed f
INNER JOIN account a ON a.id = f.id_account
ORDER BY f.feed_created_at DESC, f.feed_reference_id DESC
LIMIT :limit
