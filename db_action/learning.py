
import mysql.connector
from mysql.connector import Error

import db_action.init_mysql as init


def insert_word(prev_word :str ,current_word :str) ->None :
    
    query = "SELECT * FROM word WHERE word = %s;"
    init.my_cursor.execute(query, (current_word,))
    result = init.my_cursor.fetchall();
    if(result == []):
        query1 = """INSERT INTO word(word,count)
         VALUES (%s,1);
        """
        init.my_cursor.execute(query,(current_word,))
        result1 = init.my_cursor.fetchall()
    else: 
        print("got it")
    
    
    
    print("starting insert word function")
    try:
        init.my_cursor.execute("SELECT * FROM word ;")
        a = init.my_cursor.fetchall()
        print(a); 
    except Error as e:
        print(e);



