from flask import Flask, request, jsonify
import requests
from flask_cors import CORS, cross_origin
from util import check_code_quality, predict_question

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/codeCompile', methods=['POST'])
@cross_origin()
def compile_code():
    data = request.json

    url = "https://online-code-compiler.p.rapidapi.com/v1/"

    payload = {
        "language": "python3",
        "version": "latest",
        "code": data['code'],
        "input": data['input']
    }
    headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": "b0cd7629eemsh0956c482376c675p1b1de6jsn36234a14c31d",
        "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com"
    }

    response = requests.post(url, json=payload, headers=headers)

    return jsonify(response.json())

@app.route('/improve', methods=['POST'])
@cross_origin()
def improve_code():
    code = request.json['question']
    filename = "../../public/code.py"
    with open(filename, "w") as f:
        f.write(code)
    
    result = check_code_quality(filename)
    print(result)
    return jsonify({'data': 'hello'})


@app.route('/detect', methods=['POST'])
@cross_origin()
def detect():
    label = predict_question(request.json['animal'])
    return jsonify({'label': label})

if __name__ == '__main__':
    app.run(port=8000, debug=True)
