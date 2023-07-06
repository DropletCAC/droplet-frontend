import firebase_admin
from firebase_admin import credentials, firestore 
import random 
import os 

os.environ["FIRESTORE_EMULATOR_HOST"]="localhost:8080"
os.environ["GCLOUD_PROJECT"]="droplet-54c51"
cred = credentials.Certificate("credentials.json")
default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

month_data = {
  "Jan": {
    "name": "January",
    "short": "Jan",
    "number": 1,
    "days": 31
  },
  "Feb": {
    "name": "February",
    "short": "Feb",
    "number": 2,
    "days": 28
  },
  "Mar": {
    "name": "March",
    "short": "Mar",
    "number": 3,
    "days": 31
  },
  "Apr": {
    "name": "April",
    "short": "Apr",
    "number": 4,
    "days": 30
  },
  "May": {
    "name": "May",
    "short": "May",
    "number": 5,
    "days": 31
  },
  "Jun": {
    "name": "June",
    "short": "Jun",
    "number": 6,
    "days": 30
  },
  "Jul": {
    "name": "July",
    "short": "Jul",
    "number": 7,
    "days": 31
  },
  "Aug": {
    "name": "August",
    "short": "Aug",
    "number": 8,
    "days": 31
  },
  "Sep": {
    "name": "September",
    "short": "Sep",
    "number": 9,
    "days": 30
  },
  "Oct": {
    "name": "October",
    "short": "Oct",
    "number": 10,
    "days": 31
  },
  "Nov": {
    "name": "November",
    "short": "Nov",
    "number": 11,
    "days": 30
  },
  "Dec": {
    "name": "December",
    "short": "Dec",
    "number": 12,
    "days": 31
  }
}


def generateData():
  usage_data = {}

  for month_name in month_data:
      month_num = str(month_data[month_name]['number'])
      usage_data[month_num] = {}
          
      for day in range(1, month_data[month_name]['days']):
          day = str(day)
          
          usage_data[month_num][day] = [random.randint(8, 15) for x in range(0, 24)]
  return usage_data


if __name__ == "__main__":
  # db.collection("users").document("BwyZV2GQN0O1DVDsGl4BAj9W5q92").collection("meters").document("bathroom").set({
  #   "currentUsage": "0",
  # })

  db.collection("users").document("BwyZV2GQN0O1DVDsGl4BAj9W5q92").collection("usage").document("2023").set(generateData())
