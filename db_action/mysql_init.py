# use mysql and my_cursor to talk to db

import mysql.connector
from mysql.connector import Error

config={
    'user'     : 'user' ,
    'password' : 'pswd' ,
    'host'     : 'localhost/ip' ,
    'database' : 'prediction_database'
}

def init_mysql() :
    global mydb 
    global my_cursor 
    try:
        mydb = mysql.connector.connect(**config)
    except Error as e:
        print(e)
    my_cursor = mydb.cursor()





def init_table():
    create_table_query = """
    CREATE TABLE IF NOT EXISTS word(
    id INT AUTO_INCREMENT PRIMARY KEY ,
    word VARCHAR(30),
    count INT,
    INDEX word(word)
    );

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
    
    my_cursor.execute(create_table_query)
    mydb.commit()

    print("table sucessfully created ...")

    
# initiating database and creating sql


init_mysql()
init_table()



