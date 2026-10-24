import db_action.init_mysql as db_init

def init_table():
    create_table_query1 = """
    CREATE TABLE IF NOT EXISTS word(
    id INT AUTO_INCREMENT PRIMARY KEY ,
    word VARCHAR(30),
    count INT,
    INDEX word(word)
    );
    """
    create_table_query2 = """
    CREATE TABLE IF NOT EXISTS  next_word(
    prev_id INT ,
    current_id INT ,
    count INT,

    CONSTRAINT fk_id
        FOREIGN KEY (prev_id)
        REFERENCES word(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_current_id
        FOREIGN KEY (current_id)
        REFERENCES word(id)
        ON DELETE CASCADE  
    );
    """
    
    db_init.my_cursor.execute(create_table_query1)
    result = db_init.my_cursor.fetchall()
    print(f"result from initing table 1 : {result}")

    db_init.my_cursor.execute(create_table_query1)
    result = db_init.my_cursor.fetchall()
    print(f"result from initing table 2 : {result}")
