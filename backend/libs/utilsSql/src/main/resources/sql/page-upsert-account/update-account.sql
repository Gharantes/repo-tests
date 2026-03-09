UPDATE account SET
    login = :login,
    email = :email,
    password = :password,
    first_name = :first_name,
    last_name = :last_name
WHERE
    id = :id_account