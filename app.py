from flask import Flask , render_template ,request ,jsonify

import db_action.init_mysql as db_init
import db_action.init_table as tb_init
import db_action.learning as learn
import db_action.train_mysql as train
import db_action.predict as predict

app = Flask(__name__)



@app.route("/")
def hello_world():
    db_init.init_mysql()
    tb_init.init_table()
    learn.insert_word(" ","hello")
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'text_file' not in request.files:
        return jsonify({'error': 'No file part found'}), 400
    file = request.files['text_file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if file and file.filename.endswith('.txt'): #type: ignore
        
        # --- YOUR BACKEND LOGIC HERE ---
        print("Starting to train my db")
        train.train_mysql_txt(file)

        # Return a response back to the frontend
        return jsonify({
            'success': True,
            'filename': file.filename,
            'message': 'File successfully received by backend!'
        })
    return jsonify({'error': 'Invalid file format. Only .txt allowed'}), 400


@app.route('/predict', methods=["POST"])
def predict_next_words():
    global last_word
    data = request.get_json()
    print(data)
    current_word = data['current_word']
    previous_word = data['previous_word']

    my_dict = predict.predict_next_word(previous_word ,current_word )
    print(my_dict)
    if my_dict != {} :
        print("this is running")
        return jsonify(my_dict)
    return jsonify({"error":"nothing in json"}), 500


if __name__ == "__main__":
    app.run(debug=True)