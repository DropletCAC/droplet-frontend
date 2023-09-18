import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { VictoryPie, VictoryLabel } from 'victory-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { BarChart } from "react-native-chart-kit";
import { Foundation, Feather } from '@expo/vector-icons'; 
import * as Device from 'expo-device';
import Constants from "expo-constants";
import * as Notifications from 'expo-notifications';

//const graphicColor = ["tomato", "yellow"]
; // Colors
const defaultGraphicData = [{ y: 100 }, { y: 0 }]; // Data used to make the animate prop work

function chartConfig(color) {
  return {
    decimalPlaces: 0,
    backgroundColor: "rgb(22, 23, 24)",
    backgroundGradientFrom: "rgb(22, 23, 24)",
    backgroundGradientTo: "rgb(22, 23, 24)",
    color: (opacity = 1) => `rgba(${color}, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "4",
      stroke: "#00008B"
    }
  }
}

export default function Home() {
  const navigation = useNavigation()
  const today = new Date();
  const [graphicData, setGraphicData] = useState(defaultGraphicData);
  const [graphicColor, setGraphicColor] = useState([])
  const [data, setData] = useState({})
  const [meters, setMeters] = useState([])
  const [meterData, setMeterData] = useState([])
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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

      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          expoPushToken: token['data'],
        })
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  useEffect(() => {
    
    const calculateAverage = async() => {
      const snap = await getData()
      const data = snap.data()

      let days = 0
      let total = 0
      for (const [month, month_data] of Object.entries(data)) {
        for (const [day, day_data] of Object.entries(month_data)) {
          total += day_data.reduce((a, b) => parseInt(a) + parseInt(b), 0);
          days += 1
        }
      }

      const daily_avg = Math.round(total/days)
      today_total = data[today.getMonth() + 1][today.getDate()].reduce((a, b) => parseInt(a) + parseInt(b), 0)

      // console.log(today.getMonth() + 1, today.getDate());
      // console.log(data[today.getMonth() + 1][today.getDate()]);
      // console.log(today_total, daily_avg);

      const graphicData = []

      if (today_total < daily_avg) {
        graphicData.push({ y: (today_total/daily_avg)}, { y: (1-(today_total/daily_avg))})
        setGraphicColor(['#6fb3b8', '#388087'])
      } else {
        graphicData.push({ y: ((today_total/daily_avg) - 1) * 100}, { y: 100})
        setGraphicColor(["tomato", '#388087'])
      }
      
      setGraphicData(graphicData);

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

    }
    
    const calculateMeters = async() => {
      const querySnapshot = await getMeters()
      const newMeters = []
      const newData = []

      querySnapshot.forEach(async (doc) => {
        newMeters.push(doc.id)
      });

      for (const meter of newMeters) {
          const snap = await firebase 
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("meters")
            .doc(meter)
            .collection("usage")
            .doc(today.getFullYear().toString())
            .get()

          const data = snap.data()
          const todayData = data[today.getMonth() + 1][today.getDate()].reduce((a, b) => parseInt(a) + parseInt(b), 0)
          newData.push(todayData)
      }

      setMeters(newMeters)
      setMeterData(newData)
    }


    calculateAverage()
      .catch(console.error)
    
    calculateMeters()
      .catch(console.error)
  }, []);


  async function getData() {
    return await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("usage")
    .doc(today.getFullYear().toString())
    .get()
  }

  async function getMeters() {
    return await firebase 
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("meters")
      .get()
  }

  async function handleUsage() {
    snap = await getData()
    navigation.navigate("Usage", {"data": snap.data()})
  }


  return (
      <View style={styles.container}>
         <View style={{justifyContent: "space-between", flexDirection: "row", flex: (1), marginTop: 50}}>
            <TouchableOpacity>
              <Foundation name="lightbulb" size={25} color="white" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Feather name="settings" size={25} color="white" />            
            </TouchableOpacity>
          </View>
        <View style={styles.graph_container}>
          <VictoryPie
            animate={{ easing: 'exp', duration: 5000 }}
            data={graphicData}
            width={Dimensions.get("window").width}
            height={300}
            colorScale={graphicColor}
            innerRadius={50}
            labels={["Today's\nUsage", "Daily\nAverage"]}
            labelComponent={<VictoryLabel/>}
            style={{
              labels: {fill: "white"}
            }}
         />

        <BarChart
            data={{
              labels: meters,
              datasets: [
                {
                  data: meterData,
                }
              ]
            }}
            chartConfig={chartConfig("0")}
            width={Dimensions.get("window").width} 
            height={300}
            withInnerLines={false}
            withOuterLines={false}
            fromZero={true}
            withHorizontalLabels={false}
            withVerticalLabels={true}
          />
        </View>
        




        <View style={styles.buttons}>
          <TouchableOpacity
              style={styles.button}
              onPress={handleUsage}>
              <Text style={styles.button_text}>Usage</Text>
              <View style={styles.icon}>
                <Icon name="arrow-right" size={12} color="white"/>
              </View>
          </TouchableOpacity>

          <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Meters')}>
                <Text style={styles.button_text}>Meters</Text>
              <View style={styles.icon}>
                <Icon name="arrow-right" size={12} color="white"/>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('LeakDetection')}>
                <Text style={styles.button_text}>Leaks</Text>
                <View style={styles.icon}>
                  <Icon name="arrow-right" size={12} color="white"/>
                </View>
            </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    padding: 15,
    backgroundColor: "rgb(22, 23, 24)",
    flexDirection: 'column',
  },

  button: {
    marginVertical: 15,
    backgroundColor: "rgb(22, 23, 24)",
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
  },

  button_text: {
    color: "rgb(255, 255, 255)",
  },

  icon: {
    marginLeft: 10, 
  },

  graph_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: (5),
    padding: 20,
  },

  text: {
    color: 'white',
  },

  buttons: {
    flex: (2),
    marginTop: 50,
    justifyContent: "center"
  }
});