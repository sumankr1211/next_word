
import mysql.connector
from mysql.connector import Error

import db_action.init_mysql as init


def insert_word(prev_word :str ,current_word :str) ->None :

    print(f"working on previous word =[{prev_word}] and current word = [{current_word}]")
    
    query = "SELECT * FROM word WHERE word = %s;"
    init.my_cursor.execute(query, (current_word,))
    id_current = init.my_cursor.fetchall();

    init.my_cursor.execute(query, (prev_word,))
    id_prev = init.my_cursor.fetchall()

    if(id_prev == []):
        query1 = """
        INSERT INTO word(word,count) VALUES (%s,1) ON DUPLICATE KEY UPDATE count = count + 1;
        """
        init.my_cursor.execute(query1, (prev_word,))
        result = init.my_cursor.fetchall()
        print("previous id is empty ")
    if(id_current == []):
        query1 = """
        INSERT INTO word(word,count) VALUES (%s,1) ON DUPLICATE KEY UPDATE count = count + 1;
        """
        init.my_cursor.execute(query1, (current_word,))
        result = init.my_cursor.fetchall()
        print("cuurent if is empty")

    init.my_cursor.execute(query,(prev_word,))
    r2 = (init.my_cursor.fetchall())
    id_prev = int(r2[0][0]) if r2 else None  #type:ignore
    init.my_cursor.execute(query,(current_word,))
    r3 = (init.my_cursor.fetchall())
    print(r3)
    id_current = int(r3[0][0]) if r3 else None #type: ignore 

    print(f"id for previous word = {id_prev} , id for cuurent word = {id_current}")

    query3 = """
    INSERT INTO next_word (prev_id, current_id, count) 
    VALUES (%s, %s, 1)
    ON DUPLICATE KEY UPDATE count = count + 1
    """
    init.my_cursor.execute(query3, (id_prev, id_current,))
    init.mydb.commit()
    result = init.my_cursor.fetchall()
    print(result)




