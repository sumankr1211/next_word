import db_action.init_mysql as db_init

def find_word_match(w):
    regex = w+"%";
    query = """
    SELECT word,count FROM word where word LIKE %s LIMIT 5
    """
    db_init.my_cursor.execute(query, (regex,))
    result = db_init.my_cursor.fetchall()
    my_dict = dict(result) #type: ignore   
    return my_dict

def predict_next_word(prev_word , current_word):
    print(f"previous word = [{prev_word}] and cuurent word = [{current_word}]")

    if prev_word == " ":
        return find_word_match(current_word)
    else : 
        prev_id_query = """
        SELECT id FROM word WHERE word = %s ;
        """
        db_init.my_cursor.execute(prev_id_query ,(prev_word,))
        result = db_init.my_cursor.fetchall()
        prev_id = int(result[0][0]) if result else None#type: ignore

        #will need to optimize this query in future 
        query = """
        SELECT word.word, next_word.count 
        FROM next_word 
        INNER JOIN word ON word.id = next_word.current_id 
        WHERE next_word.prev_id = %s 
        ORDER BY next_word.count DESC 
        LIMIT 5;
        """

    db_init.my_cursor.execute(query, (prev_id,))
    result1 = db_init.my_cursor.fetchall()
    return (dict(result1) if result else {None:None}) #type: ignore 
        