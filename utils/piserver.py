from flask import Flask, request
import firebase_admin
from firebase_admin import credentials, firestore 
import json
cred = credentials.Certificate("credentials.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)


@app.route('/setup', methods=['GET'])
def setup():
    user = request.args.get('user')
    print("Setting up and pairing to user", user)
    
    with open("user.json", "w+") as file:
        file.write(json.dumps({"user": user}))
        
    return json.dumps({"success": True, "user": user})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)