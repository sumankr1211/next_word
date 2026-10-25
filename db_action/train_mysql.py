import db_action.learning as learn

prev_word = " "
current_word = " "

def train_mysql_txt(file):
    print("trying to open file")

    text = file.read().decode('utf-8') 
    words = text.split()
    global prev_word
    global current_word
    for i in words:
        current_word = i 
        learn.insert_word(prev_word ,current_word)
        prev_word = current_word    
    print("completed training data on current file")
    