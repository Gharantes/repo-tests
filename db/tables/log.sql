create TABLE LOG (
    id serial4 primary key,
    insert_time timestamp not null,
    operation_type varchar(6),
    relevant_table varchar(32),
    log_message text
)