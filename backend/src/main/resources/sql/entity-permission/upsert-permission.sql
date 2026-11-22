INSERT INTO permission (id, label, description, category)
VALUES (:id, :label, :description, :category)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    category = EXCLUDED.category
