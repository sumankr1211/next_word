# use mysql and my_cursor to talk to db

import mysql.connector

config = {
    'user'     : 'username' ,
    'password' : 'abc' ,
    'host'     : 'localhosr/ip of database' ,
    'database' : 'abc'
}

def init_mysql() :
    global mydb 
    mydb = mysql.connector.connect(**config)
    global my_cursor 
    my_cursor = mydb.cursor()

init_mysql()



