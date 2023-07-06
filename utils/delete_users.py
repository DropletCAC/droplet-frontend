# Start listing users from the beginning, 1000 at a time.
import firebase_admin
from firebase_admin import auth 
from firebase_admin import credentials

cred = credentials.Certificate("credentials.json")
default_app = firebase_admin.initialize_app(cred)

for user in auth.list_users().iterate_all():
    print('User: ' + user.uid)
    auth.delete_user(user.uid)