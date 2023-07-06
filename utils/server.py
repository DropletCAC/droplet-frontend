# import main Flask class and request object
from flask import Flask, request

# create the Flask app
app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def hello():
    if request.method == "GET":
        return 'Hello World'
    elif request.method == "POST": 
        print(request.headers)
        return "success"


if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000, host="0.0.0.0")