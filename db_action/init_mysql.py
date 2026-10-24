# use mysql and my_cursor to talk to db

import mysql.connector
from mysql.connector import Error

config={
    'user'     : 'user' ,
    'password' : 'pswd' ,
    'host'     : 'localhost/ip' ,
    'database' : 'prediction_database'
}

mydb = None
my_cursor = None

def init_mysql() :
    global mydb 
    global my_cursor
    try:
        mydb = mysql.connector.connect(**config)
        my_cursor = mydb.cursor(buffered=True)
        print("Database connected sucessfully ... ")
    except Error as e:
        print(e)





