from flask import Flask, request
import firebase_admin
from firebase_admin import credentials, firestore 
import json
import RPi.GPIO as GPIO
import time, sys, os
from datetime import datetime 
import threading 

cred = credentials.Certificate("credentials.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)


class Meter:
    def __init__(self, user_id, section):
        self.count = 0
        self.start_counter = 0
        self.user_id = user_id
        self.section = section 

    def send(self, gal):
        db.collection("users").document(self.user_id).collection("meters").document(self.section).set({
            "currentUsage": gal, 
        })

    def countPulse(self, channel):
        if self.start_counter == 1:
            self.count = self.count+1


    def startMeter(self):
        FLOW_SENSOR_GPIO = 13
        
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(FLOW_SENSOR_GPIO, GPIO.IN, pull_up_down = GPIO.PUD_UP)
        

        GPIO.add_event_detect(FLOW_SENSOR_GPIO, GPIO.FALLING, callback=self.countPulse)

        while True:
            try:                
                start_counter = 1
                print("Starting counter...")
                time.sleep(60)
                print("Calculating")
                start_counter = 0
                flow = (count / 7.5) # Pulse frequency (Hz) = 7.5Q, Q is flow rate in L/min.
                gal = flow / 3.785

                message = f"Flow Rate: {flow} L/min | {gal} gal/min"
                print(message)

                self.count = 0
            except KeyboardInterrupt:
                print('\nkeyboard interrupt!')
                GPIO.cleanup()
                sys.exit()


        def send(message):
            print("Sending")


@app.route('/setup', methods=['GET'])
def setup():
    user = request.args.get('user')
    section = request.args.get('user')

    print("Setting up and pairing to user", user)
    
    with open("user.json", "w+") as file:
        file.write(json.dumps({"user": user, "section": section}))
    
    meter = Meter(user, section)
    func = threading.Thread(target=meter.startMeter)
    func.start()

    return json.dumps({"success": True, "user": user})


if __name__ == "__main__":
    if os.path.exists("user.json"):
        with open("user.json") as file:
            user_data = json.load(file)
            print(user_data)
            meter = Meter(user_data['user'], user_data['section'])
            meter.startMeter()
    else:
        app.run(host="0.0.0.0", port=8080)