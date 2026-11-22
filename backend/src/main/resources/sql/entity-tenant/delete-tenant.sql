-- O banco não tem foreign keys: cada tabela que pertence ao tenant é apagada aqui,
-- relacionamentos antes das entidades. `permission` é global e fica.
DELETE FROM notification WHERE id_tenant = :id_tenant;
DELETE FROM project_join_request WHERE id_tenant = :id_tenant;
DELETE FROM conversation_message
WHERE id_conversation IN (SELECT id FROM conversation WHERE id_tenant = :id_tenant);

DELETE FROM conversation_read
WHERE id_conversation IN (SELECT id FROM conversation WHERE id_tenant = :id_tenant);

DELETE FROM conversation_member
WHERE id_conversation IN (SELECT id FROM conversation WHERE id_tenant = :id_tenant);

DELETE FROM conversation WHERE id_tenant = :id_tenant;

DELETE FROM project_note_relationship
WHERE id_note IN (SELECT id FROM note WHERE id_tenant = :id_tenant);

DELETE FROM event_note_relationship
WHERE id_note IN (SELECT id FROM note WHERE id_tenant = :id_tenant);

DELETE FROM note WHERE id_tenant = :id_tenant;

DELETE FROM calendar_entry WHERE id_tenant = :id_tenant;

DELETE FROM event_post_relationship
WHERE id_event IN (SELECT id FROM event WHERE id_tenant = :id_tenant)
   OR id_post IN (SELECT p.id FROM post p JOIN account a ON a.id = p.id_account WHERE a.id_tenant = :id_tenant);

DELETE FROM post
WHERE id_account IN (SELECT id FROM account WHERE id_tenant = :id_tenant);

DELETE FROM project_event_relationship
WHERE id_project IN (SELECT id FROM project WHERE id_tenant = :id_tenant)
   OR id_event IN (SELECT id FROM event WHERE id_tenant = :id_tenant);

DELETE FROM account_permission_relationship
WHERE id_account IN (SELECT id FROM account WHERE id_tenant = :id_tenant);

DELETE FROM account_permission_profile_relationship
WHERE id_account IN (SELECT id FROM account WHERE id_tenant = :id_tenant)
   OR id_profile IN (SELECT id FROM permission_profile WHERE id_tenant = :id_tenant);

DELETE FROM permission_profile_permission_relationship
WHERE id_profile IN (SELECT id FROM permission_profile WHERE id_tenant = :id_tenant);

DELETE FROM permission_profile WHERE id_tenant = :id_tenant;

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
