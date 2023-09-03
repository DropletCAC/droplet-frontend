import { useState, useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Usage from "./screens/usage";
import Meters from "./screens/meters";
import Home from "./screens/home";
import AuthScreen from "./screens/auth";
import TestPage from './screens/test';
import LeakDetection from './screens/leakdetection';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import firebase from "firebase/compat/app";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const Stack = createNativeStackNavigator();


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
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      console.log("poooo" + JSON.stringify(Constants.expoConfig.extra.eas.projectId))
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }


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
        <Stack.Screen name="LeakDetection" component={LeakDetection} options={{ headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
