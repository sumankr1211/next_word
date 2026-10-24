from flask import Flask
from flask import render_template

import db_action.init_mysql as db_init
import db_action.init_table as tb_init
import db_action.learning as learn


app = Flask(__name__)



@app.route("/")
def hello_world():
    db_init.init_mysql()
    tb_init.init_table()
    learn.insert_word(" ","hello")
    return render_template('index.html')




if __name__ == "__main__":
    app.run(debug=True)