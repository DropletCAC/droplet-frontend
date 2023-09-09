import firebase_admin
from firebase_admin import credentials, firestore 
import random 
import time 
import os 
from datetime import datetime 

import argparse
parser = argparse.ArgumentParser()
parser.add_argument('-e', '--emulator', action='store_true')
parser.add_argument('-s', '--section')
args = parser.parse_args()

if args.emulator:
    os.environ["FIRESTORE_EMULATOR_HOST"]="localhost:8080"
    os.environ["GCLOUD_PROJECT"]="droplet-54c51"
 
cred = credentials.Certificate("credentials.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

daily_usages = {
        0:2,
        1:2,
        2:0,
        3:3,
        4:1,
        5:11,
        6:22,
        7:8,
        8:6,
        9:42,
        10:17,
        11:9,
        12:32,
        13:17,
        14:15,
        15:21,
        16:17,
        17:12,
        18:9,
        19:6,
        20:3,
        21:3,
        22:3,
        23:0,
}

def generateHourlyUsage(hour):
    return str(max(0, daily_usages[hour] + random.randint(-2, 2)))


class Meter:
    def __init__(self, user_id, *, name, delay=5):
        self.name = name
        self.usage = {hour: 0 for (hour, value) in daily_usages.items()}
        
        while True:
            hour = datetime.now().hour
            
            on = random.randint(0, 5)
            if (on == 5) and (self.usage[hour] < daily_usages[hour]):   
                print("Turning faucet on")
                gal = 1 
            else: 
                gal = 0
                
            print("Set current usage to", gal)
            db.collection("users").document(user_id).collection("meters").document(name).set({
                "currentUsage": gal, 
            })
            
            time.sleep(delay)
            

if __name__ == "__main__": 
    if args.emulator:
        print("Starting in emulator mode...")

    print("Starting in", args.section)
    Meter("BwyZV2GQN0O1DVDsGl4BAj9W5q92", name=args.section)
            
    