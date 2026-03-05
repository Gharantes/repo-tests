WITH
total as (
    SELECT
        id_ref,
        entity_ref,
        count(1) as qtd_views,
        MIN(at) as record_start,
        MAX(at) as record_end
    FROM statistics_views
    WHERE at < CURRENT_DATE
    GROUP BY id_ref, entity_ref
),
uniques_raw as (
    SELECT DISTINCT id_ref, entity_ref, id_account
    FROM statistics_views
    WHERE at < CURRENT_DATE
),
uniques as (
    SELECT
        id_ref,
        entity_ref,
        count(1) as qtd_unique_views
    FROM uniques_raw
    GROUP BY id_ref, entity_ref
)
INSERT INTO statistics_anonimized_views (
	qtd_views,
	qtd_unique_views,
	id_ref,
	entity_ref,
	record_start,
	record_end
)
SELECT
    t.qtd_views,
    u.qtd_unique_views,
    t.id_ref,
    t.entity_ref,
    t.record_start,
    t.record_end
FROM total t
INNER JOIN uniques u ON
    t.id_ref = u.id_ref and
    t.entity_ref = u.entity_ref