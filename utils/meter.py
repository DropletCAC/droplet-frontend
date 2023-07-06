import firebase_admin
from firebase_admin import credentials, firestore 
import random 
import time 
import os 

import argparse
parser = argparse.ArgumentParser()
parser.add_argument('-e', '--emulator', action='store_true')
args = parser.parse_args()

cred = credentials.Certificate("credentials.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()


class Meter:
    def __init__(self, user_id, *, name, delay=5):
        self.name = name
        while True:
            gal = str(random.randint(1, 10))
            db.collection("users").document(user_id).collection("meters").document(name).set({
                "currentUsage": gal, 
            })
            print("Set current usage to", gal)
            time.sleep(delay)
            

if __name__ == "__main__": 
    if args.emulator:
        print("Starting in emulator mode...")
        os.environ["FIRESTORE_EMULATOR_HOST"]="localhost:8080"
        os.environ["GCLOUD_PROJECT"]="droplet-54c51"
        
    Meter("BwyZV2GQN0O1DVDsGl4BAj9W5q92", name="bathroom")
            
    