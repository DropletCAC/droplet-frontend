import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

export async function register(email, password) {
    await firebase
     .auth()
     .createUserWithEmailAndPassword(email, password)
    .then(() => {
        console.log("Registered new user with UID", firebase.auth().currentUser.uid)
    })
}

export async function login(email, password) {
    await firebase 
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
        console.log("Logged in with UID", firebase.auth().currentUser.uid)
    })
}
