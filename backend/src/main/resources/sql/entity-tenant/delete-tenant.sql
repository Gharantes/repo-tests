-- O banco não tem foreign keys: cada tabela que pertence ao tenant é apagada aqui,
-- relacionamentos antes das entidades. `permission` é global e fica.
DELETE FROM event_post_relationship
WHERE id_event IN (SELECT id FROM event WHERE id_tenant = :id_tenant)
   OR id_post IN (SELECT p.id FROM post p JOIN account a ON a.id = p.id_account WHERE a.id_tenant = :id_tenant);

DELETE FROM post
WHERE id_account IN (SELECT id FROM account WHERE id_tenant = :id_tenant);

DELETE FROM account_tag_relationship
WHERE id_account IN (SELECT id FROM account WHERE id_tenant = :id_tenant)
   OR id_tag IN (SELECT id FROM tags WHERE id_tenant = :id_tenant);

DELETE FROM project_tag_relationship
WHERE id_project IN (SELECT id FROM project WHERE id_tenant = :id_tenant)
   OR id_tag IN (SELECT id FROM tags WHERE id_tenant = :id_tenant);

DELETE FROM event_tag_relationship
WHERE id_event IN (SELECT id FROM event WHERE id_tenant = :id_tenant)
   OR id_tag IN (SELECT id FROM tags WHERE id_tenant = :id_tenant);

DELETE FROM project_account_relationship
WHERE id_project IN (SELECT id FROM project WHERE id_tenant = :id_tenant)
   OR id_account IN (SELECT id FROM account WHERE id_tenant = :id_tenant);

DELETE FROM event_account_relationship
WHERE id_event IN (SELECT id FROM event WHERE id_tenant = :id_tenant)
   OR id_account IN (SELECT id FROM account WHERE id_tenant = :id_tenant);

DELETE FROM tags WHERE id_tenant = :id_tenant;
DELETE FROM project WHERE id_tenant = :id_tenant;
DELETE FROM event WHERE id_tenant = :id_tenant;
DELETE FROM account WHERE id_tenant = :id_tenant;
DELETE FROM tenant WHERE id = :id_tenant;
