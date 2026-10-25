from flask import Flask , render_template ,request ,jsonify

import db_action.init_mysql as db_init
import db_action.init_table as tb_init
import db_action.learning as learn
import db_action.train_mysql as train

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
    if file and file.filename.endswith('.txt'):
        
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


if __name__ == "__main__":
    app.run(debug=True)