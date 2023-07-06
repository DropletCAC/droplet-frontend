import firebase_admin
from firebase_admin import credentials, firestore 

cred = credentials.Certificate("credentials.json")
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

total = 0

monthly_usage = db.collection("users").document("BwyZV2GQN0O1DVDsGl4BAj9W5q92").collection("usage").document("2023").get().to_dict()["2"]
for day in monthly_usage:
    for hour in monthly_usage[day]:
        print(day)
        total += hour

print(total)