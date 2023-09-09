import firebase_admin
from firebase_admin import credentials, firestore 
import random 
import os 

from datetime import datetime
today = datetime.now()
month = int(today.strftime("%m"))
day = int(today.strftime("%d"))
hour = int(today.strftime("%H"))
print(hour)

import argparse
parser = argparse.ArgumentParser()
parser.add_argument('-e', '--emulator', action='store_true')
args = parser.parse_args()

if args.emulator:
  print("Starting in emulator mode...")
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

def generateHourlyUsage(hour):
    usages = {
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
    
    return str(max(0, usages[hour] + random.randint(-2, 2)))

def generateDailyUsage(stop=24):
  day = []
  for hour in range(0, stop):
    day.append(generateHourlyUsage(hour))
  return day

def generateData(stop_month, stop_day, stop_hour):
  usage_data = {}

  for month_name in month_data:
      
      month_num = str(month_data[month_name]['number'])
      usage_data[month_num] = {}
          
      for day in range(1, month_data[month_name]['days']):

        if (month_data[month_name]['number'] == stop_month):
          if (day == stop_day):
            day = str(day)
            usage_data[month_num][day] = generateDailyUsage(stop=stop_hour)
            continue
          
          if (day == stop_day + 1):
            return usage_data
          
        day = str(day)
        usage_data[month_num][day] = generateDailyUsage()
          
  return usage_data

def generateCSVData():
  data = {
  "0": "1",
  "1": "2",
  "2": "1",
  "3": "3",
  "4": "2",
  "5": "9",
  "6": "20",
  "7": "10",
  "8": "8",
  "9": "40",
  "10": "15",
  "11": "8",
  "12": "30",
  "13": "18",
  "14": "15",
  "15": "21",
  '16': "15",
  "17": "14",
  "18": "8",
  "19": "8",
  "20": "4",
  "21": "2",
  "22": "4",
  "23": "1",
  }

  with open("data.csv", "a+") as file:
    for (key, value) in data.items():
      file.write("\n" + key + "," + str(max(int(value) + random.randint(-2, 2), 0)))
       
if __name__ == "__main__":
  # db.collection("users").document("BwyZV2GQN0O1DVDsGl4BAj9W5q92").collection("meters").document("bathroom").set({
  #   "currentUsage": "0",
  # })

  db.collection("users").document("BwyZV2GQN0O1DVDsGl4BAj9W5q92").collection("usage").document("2023").set(generateData(month, day ,hour))  
  db.collection("users").document("BwyZV2GQN0O1DVDsGl4BAj9W5q92").collection("meters").document("bathroom").collection("usage").document("2023").set(generateData(month, day, hour))
  db.collection("users").document("BwyZV2GQN0O1DVDsGl4BAj9W5q92").collection("meters").document("lawn").collection("usage").document("2023").set(generateData(month, day, hour))