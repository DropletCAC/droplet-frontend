import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Usage from "./screens/usage";
import Meters from "./screens/meters";
import Home from "./screens/home";
import AuthScreen from "./screens/auth";
import TestPage from './screens/test';
const Stack = createNativeStackNavigator();
import firebase from "firebase/compat/app";


const firebaseConfig = {
  apiKey: "AIzaSyBB_INbi2kbO_u_wAq0PbhG_6LqOcRS9Yw",
  authDomain: "droplet-54c51.firebaseapp.com",
  projectId: "droplet-54c51",
  storageBucket: "droplet-54c51.appspot.com",
  messagingSenderId: "433210608289",
  appId: "1:433210608289:web:dee0fd8a7da2b484053ee0",
  measurementId: "G-V3MRJ03J8Q"
};

function App() {

  if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  } else {
  firebase.app();
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Usage" component={Usage} options={{ headerShown: false}} />
        <Stack.Screen name="Meters" component={Meters} options={{ headerShown: false}} />
        <Stack.Screen name="TestPage" component={TestPage} options={{ headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
