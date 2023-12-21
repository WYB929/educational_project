import requests
import os
# import openai
from flask import Flask, request, jsonify, redirect, render_template, url_for
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from util import check_code_quality, predict_question, run_python_file

app = Flask(__name__)
# openai.api_key = os.getenv("OPENAI_API_KEY")
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Path to the file_buffer directory
current_dir = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(current_dir, '../file_buffer')

# Ensure UPLOAD_FOLDER exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/codeCompile', methods=['POST'])
def compile_code():
    # data = request.json

    # url = "https://online-code-compiler.p.rapidapi.com/v1/"

    # payload = {
    #     "language": "python3",
    #     "version": "latest",
    #     "code": data['code'],
    #     "input": data['input']
    # }
    # headers = {
    #     "content-type": "application/json",
    #     "X-RapidAPI-Key": "b0cd7629eemsh0956c482376c675p1b1de6jsn36234a14c31d",
    #     "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com"
    # }

    # response = requests.post(url, json=payload, headers=headers)

    # return jsonify(response.json())
    data = request.json
    code = data['code']
    filename = "../file_buffer/code.py"
    with open(filename, "w") as f:
        f.write(code)
    filename = "../file_buffer/code.py"
    base_name = os.path.basename(filename)
    result = run_python_file(base_name)
    print(result)
    return jsonify(result)

@app.route('/improve', methods=['POST'])
def improve_code():
    code = request.json['question']
    filename = "../file_buffer/code.py"
    with open(filename, "w") as f:
        f.write(code)
    
    result = check_code_quality(filename)
    return jsonify(result)


@app.route('/detect', methods=['POST'])
def detect():
    label = predict_question(request.json['animal'])
    return jsonify({'label': label})

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        retrive_path = filename
        file.save(file_path)
    return jsonify({'message': 'File uploaded successfully', 'filename': filename, 'file_path': file_path, 'retrive_path':retrive_path})

# @app.route("/rewrite",methods=['POST'])
# def rewrite():
#     code = request.json['question']
#     response = openai.Completion.create(
#         model="gpt-3.5-turbo-instruct",
#         prompt=generate_prompt(question),
#         temperature=0.6,
#         max_tokens=2000,
#     )
#     print(code)
#     return jsonify({'data': 'hello'})
#     # if request.method == "POST":
#     #     question = request.json["question"]
#     #     response = openai.Completion.create(
#     #         model="gpt-3.5-turbo-instruct",
#     #         prompt=generate_prompt(question),
#     #         temperature=0.6,
#     #         max_tokens=2000,
#     #     )
#     #     print(question)


# def generate_prompt(question):
#     return """return `In Computer Science, {}?`""".format(question)

if __name__ == '__main__':
    app.run(port=8000, debug=True)
