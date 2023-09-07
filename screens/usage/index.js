import * as React from 'react';
import { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Button, Dimensions} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { BarChart, LineChart } from "react-native-chart-kit";
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import styles from "./styles"

const height = 750;

export default function Usage({route}) {
  const params = route.params 
  const today = new Date();
  const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  
  const navigation = useNavigation()
 

  const [data, setData] = useState(params['data'])

  const [open, setOpen] = useState(false);
  const [dropDownValue, setDropDownValue] = useState('today');
  const [items, setItems] = useState([
    {label: 'Today', value: 'today',},
    {label: 'Week', value: 'week'},
    {label: 'Year', value: 'year'},
  ]);


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


  function renderUsage(value) {
    switch(value) {
      case 'today':
        return renderTodayUsage();
      
      case 'week':
        return renderWeekUsage();

      case 'year':
        return renderYearUsage();
    }
  }


  function renderYearUsage() {
    months.length = today.getMonth() + 1;

    function getYearData() {
      const displayData = new Array(months.length)
      let currentMonth = today.getMonth() + 1;

      while (currentMonth >= 1) {
        let total = 0;
        for (let day in data[currentMonth]) {
          total += data[currentMonth][day].reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
        displayData[currentMonth - 1] = total;
        currentMonth--;
      }

      return displayData;
    }

    return (
      <BarChart
        data={{
          labels: months,
          datasets: [
            {
              data: getYearData(),
            }
          ]
        }}
        chartConfig={chartConfig("0")}
        width={Dimensions.get("window").width - 20} 
        height={height}
        yAxisSuffix=" gal"
        withInnerLines={false}
        withOuterLines={false}
        style={styles.graph}
        fromZero={true}
      />
    )
  }


  function renderWeekUsage() {
    function getWeeklyData() {
      const displayData = new Array(7).fill(0);
      const currentDay = today.getDay()
      let x = today.getDay()
      //current day = 20
      //x = 20
      while (x >= 0) {
        displayData[x] = data[today.getMonth() + 1][today.getDate() - (currentDay - x)].reduce((a, b) => parseInt(a) + parseInt(b), 0);
        x--;
      }
      return displayData
    }

    return (
      <BarChart
        data={{
          labels: weekdays,
          datasets: [
            {
              data: getWeeklyData(),
            }
          ]
        }}
        chartConfig={chartConfig("0")}
        width={Dimensions.get("window").width - 20} 
        height={height}
        yAxisSuffix=" gal"
        withInnerLines={false}
        withOuterLines={false}
        bezier
        style={styles.graph}
      />
    )
  }


  function renderTodayUsage() {
    function convert24to12(value) {
      if (value == 0) {
        return "12 AM";
      } else if (value == 12) {
        return "12 PM";
      } else if (value > 12) {
        return value - 12 + " PM"
      } else return value + " AM"
    }
  
    function add24(value, index, array) {
      if (value < 0) {
        return value + 24
      } else return value
    }
  
    function genLabels() {
      let now = new Date();
      let hour = now.getHours();
      const labels = [hour-5, hour-4, hour-3, hour-2, hour-1, hour].map(add24)
      return labels;
    }
    
    const displayData = data[today.getMonth() + 1][today.getDate()]

    const last6Hours = []
    let labels = genLabels()

    function addLabel(value) {
      last6Hours.push(displayData[value])
    }
    labels.forEach(addLabel)


    labels = labels.map(convert24to12)
    labels[5] = (today.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'}))
    
    return (
    <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: last6Hours
              }
            ]
          }}
          width={Dimensions.get("window").width} 
          height={height}
          xAxisSuffix="PM"
          yAxisSuffix=" gal"
          withInnerLines={false}
          withOuterLines={false}
          chartConfig={chartConfig("255")}
          bezier
          style={styles.graph}
          fromZero={true}
        />)
  }

  function getMessage() {
    switch (dropDownValue) {
      case "today":
        return "Usage for " + today.toDateString();
      case "week": 
        return "Usage for this week";
      case "year":
        return "Usage for " + today.getFullYear();
    }
  };

  // useEffect(() => {
  //   return () => {
  //     setData(params['data'])
  //   }
  // }, [])
  // useEffect(() => {
  //   console.log("User ID:", firebase.auth().currentUser.uid)
  //   firebase
  //   .firestore()
  //   .collection("users")
  //   .doc(firebase.auth().currentUser.uid)
  //   .collection("usage")
  //   .doc(today.getFullYear().toString())
  //   .onSnapshot((res) => {
  //     console.log("fetched data from firebase")
  //     setData(res.data())        
  //   })
  // }, [])
  if (data) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={{color: 'white'}}>{getMessage()}</Text>
          </View>
          <View>
            <DropDownPicker
              style={{backgroundColor: "rgb(22, 23, 24", color: "rgb(22, 23, 24", maxWidth: 100, marginRight: 50}}
              textStyle={{color: "white", justifyContent: "center", alignContent: "center"}}
              dropDownContainerStyle={{backgroundColor: "rgb(22, 23, 24"}}
              open={open}
              value={dropDownValue}
              items={items}
              setOpen={setOpen}
              setValue={setDropDownValue}
              setItems={setItems}
          />
          </View>
        </View>
  
      <View style={styles.graph}>
        {renderUsage(dropDownValue)}
      </View>
    </View>
    );
  }
}

