import * as React from 'react';
import { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Button, Dimensions, ScrollView, Modal, Pressable, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { BarChart, LineChart } from "react-native-chart-kit";
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import styles from "./styles"
import { Ionicons } from '@expo/vector-icons'; 

const height = 750;

export default function Usage({route}) {
  const params = route.params 
  const today = new Date();
  const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  
  const navigation = useNavigation()
  
  const [data, setData] = useState(params['data'])
  const [rate, setRate] = useState()

  const [modalVisible, setModalVisible] = useState(false)
  const [text, onChangeText] = useState("")

  const [open, setOpen] = useState(false);
  const [dropDownValue, setDropDownValue] = useState('today');
  const [items, setItems] = useState([
    {label: 'Today', value: 'today',},
    {label: 'Week', value: 'week'},
    {label: 'Year', value: 'year'},
  ]);


  useEffect(() => {
    async function getRate() {
      const snap = await firebase 
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
    
      const data = snap.data()

      setRate(data['ccfRate'])
    }
    
    getRate()
      .catch(console.error)
  })

  const costChartConfig = {
    decimalPlaces: 0,
    backgroundColor: "rgb(22, 23, 24)",
    backgroundGradientFrom: "rgb(22, 23, 24)",
    backgroundGradientTo: "rgb(22, 23, 24)",
    color: (opacity = 1) => `rgba(255, 225, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  }

  function chartConfig(color) {
    return {
      decimalPlaces: 0,
      backgroundColor: "rgb(22, 23, 24)",
      backgroundGradientFrom: "rgb(22, 23, 24)",
      backgroundGradientTo: "rgb(22, 23, 24)",
      color: (opacity = 1) => `rgba(${color}, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
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

  function renderCost(value) {
    switch(value) {
      case 'today':
        return renderTodayCost();
      
      case 'week':
        return renderWeekCost();

      case 'year':
        return renderYearCost();
    }
  }


  function getYearData() {
    const displayData = new Array(months.length)
    let currentMonth = today.getMonth() + 1;

    while (currentMonth >= 1) {
      let total = 0;
      for (let day in data[currentMonth]) {
        total += data[currentMonth][day].reduce((a, b) => (parseInt(a) || 0) + (parseInt(b) || 0), 0);
      }
      displayData[currentMonth - 1] = total;
      currentMonth--;
    }

    return displayData.slice(today.getMonth() + 1 - 6);
  }

  function renderYearCost() {
    return getYearData().map(usage => Math.ceil(usage * rate / 748))
  }

  function renderYearUsage() {
    months.length = today.getMonth() + 1;

    return (
      <BarChart
        data={{
          labels: months.slice(today.getMonth() + 1 - 6),
          datasets: [{data: getYearData()}]
        }}
        chartConfig={chartConfig("0")}
        width={Dimensions.get("window").width - 50} 
        height={height}
        yAxisSuffix=" gal"
        withInnerLines={false}
        withOuterLines={false}
        style={styles.graph}
        fromZero={true}
      />
    )
  }

  function getWeeklyData() {
    const displayData = new Array(7).fill(0);
    const currentDay = today.getDay()
    let x = today.getDay()

    while (x >= 0) {
      displayData[x] = data[today.getMonth() + 1][today.getDate() - (currentDay - x)].reduce((a, b) => (parseInt(a) || 0) + (parseInt(b) || 0), 0);
      x--;
    }
    return displayData
  }

  function renderWeekCost() {
    console.log("HERE", getWeeklyData().map(usage => rate * usage))
    return getWeeklyData().map(usage => Math.ceil(rate * usage / 748))
  }

  function renderWeekUsage() {
    return (
      <BarChart
        data={{
          labels: weekdays,
          datasets: [{data: getWeeklyData()}]
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


  function renderTodayCost() {
    const todayUsage = data[today.getMonth() + 1][today.getDate()].reduce((a, b) => (parseInt(a) || 0) + (parseInt(b) || 0), 0);
    return [Math.ceil(todayUsage * rate / 748)]
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
      let hour = today.getHours();
      const labels = [hour-5, hour-4, hour-3, hour-2, hour-1, hour].map(add24)
      return labels;
    }
    
    const displayData = data[today.getMonth() + 1][today.getDate()]

    const last6Hours = []
    let labels = genLabels()

    function addLabel(value) {
      last6Hours.push(displayData[value] || 0)
    }
    labels.forEach(addLabel)


    labels = labels.map(convert24to12)
    labels[5] = (today.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'}))
    
    return (
      <LineChart
            data={{
              labels: labels,
              datasets: [{data: last6Hours}]
            }}
            width={Dimensions.get("window").width} 
            height={height}
            xAxisSuffix="PM"
            yAxisSuffix=" gal   "
            withInnerLines={false}
            withOuterLines={false}
            chartConfig={chartConfig("255")}
            bezier
            style={styles.graph}
            fromZero={true}
          />
    )}
  
  
  function getMessage() {
    switch (dropDownValue) {
      case "today":
        return "Today's Usage";
      case "week": 
        return "This Week's Usage";
      case "year":
        return today.getFullYear() + "'s Usage";
    }
  };  

  async function handleRateUpdate() {
    await firebase 
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        "ccfRate": text
      })
    
    setModalVisible(!modalVisible)
  }

  if (data && rate) {
    return (
      <ScrollView style={styles.container}>
        <View style={{justifyContent: "center"}}>
        <View style={styles.header}>
          <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Enter your $/CCF Rate from your previous water bill</Text>
                <Text style={[styles.modalText, {fontSize: 9}]}>This is the cost per 100 cubic feet (748 gallons) of water</Text>

                <TextInput style={styles.input} onChangeText={onChangeText} value={text} placeholder="1.02" placeholderTextColor={"black"} />

                <Pressable
                  style={[styles.button]}
                  onPress={handleRateUpdate}>
                  <Text style={styles.textStyle}>Update</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          </View>
          <View style={{flex: 1}}>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
          </View>
          <View style={{flex: 1.1}}>
            <Text style={{color: 'white'}}>{getMessage()}</Text>
          </View>
          <View style={{flex: 1}}>
            <DropDownPicker
              style={{backgroundColor: "rgb(22, 23, 24", color: "rgb(22, 23, 24)", maxWidth: "80%", marginLeft: 30, justifyContent: "center", zIndex: 2}}
              textStyle={{color: "white"}}
              dropDownContainerStyle={{backgroundColor: "rgb(22, 23, 24"}}
              open={open}
              value={dropDownValue}
              items={items}
              setOpen={setOpen}
              setValue={setDropDownValue}
              setItems={setItems}
              listMode='SCROLLVIEW'
          />
          </View>
        </View>
  
      <View>
        {renderUsage(dropDownValue)}
      </View>
      
      <View style={{justifyContent: "center", alignItems: "center", marginBottom: 50}}>
        <BarChart
          data={{
            labels: renderCost(dropDownValue),
            datasets: [
              {
                data: renderCost(dropDownValue),
              }
            ]
          }}
          chartConfig={costChartConfig}
          width={Dimensions.get("window").width} 
          height={Dimensions.get("window").height - 400}
          withInnerLines={false}
          withOuterLines={false}
          fromZero={true}
          withHorizontalLabels={false}
          xAxisLabel='$'
          style={[styles.graph, {marginLeft: (dropDownValue === "today") ? (Dimensions.get("window").width / 2) + 30 : -5}]}
        />

        <Text style={{color: "white"}}>Estimated Cost Based on ${rate}/CCF</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{color: "white", fontSize: 10, marginTop: 10}}>Not your current water rate?</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
    );
  }
}

