import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { FlatList, Modal, View, Text, Pressable, TouchableOpacity, TextInput, Alert } from 'react-native';
import styles from "./styles";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Entypo, Feather, Ionicons } from '@expo/vector-icons'; 

const port = 8080

export default function Meters() {
    const navigation = useNavigation()
    const [meters, setMeters] = useState([])
    const today = new Date();
    const [addMeterVisible, setAddMeterVisible] = useState(false)
    const [deviceName, onChangeText] = useState('raspberrypi.local');

    async function handleUsage({key}) {
      console.log("Fetching usage data for meter:", key)
      const snap = await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("meters")
        .doc(key)
        .collection("usage")
        .doc(today.getFullYear().toString())
        .get()
      
      navigation.navigate("Usage", {"data": snap.data()})        
    }

    async function setupMeter() {
      try {
        const url = `http://${deviceName}:${port}/setup?user=${firebase.auth().currentUser.uid}`
        console.log("TRYING", url)
        const response = await fetch(url)
        console.log("RESPONSE CODE", response.status)
        const json = await response.json()
        console.log("JSON", json)
      } catch (error) {
        console.log(error)
        Alert.alert("Pairing Failed. Please double check your device is powered on.")
      } finally {
        setAddMeterVisible(!addMeterVisible)
      }
    }

    useEffect(() => {
      const unsubscribe =
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("meters")
          .onSnapshot(querySnapshot => {
            const newDocs = []

            querySnapshot.forEach(documentSnapshot => {
              console.log(documentSnapshot.data())
              newDocs.push({
                key: documentSnapshot.id,
                usage: documentSnapshot.data()['currentUsage'],
              })
            })

            setMeters(newDocs)
          })
      


      return () => {
        unsubscribe()
      }
    }, []);
    
    
    const Item = ({data}) => (
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: pressed ? 'rgb(30, 30, 30)' : 'rgb(22, 23, 24)' },
            styles.meter_pressable
          ]}
          onPress={() => handleUsage(data)}>
          
          
          <Text style={styles.text}>{data.key}</Text>

          <Text style={styles.text}>{data.usage} gal/min</Text>
        </Pressable>


      );

    return (
        <View style={styles.container}>
           <Modal
            animationType="slide"
            transparent={true}
            visible={addMeterVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setAddMeterVisible(!addMeterVisible);
            }}>
              
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Enter Device ID</Text>
                <TextInput
                  editable
                  onChangeText={text => onChangeText(text)}
                  value={deviceName}
                  style={{padding: 15, width: "100%", textDecorationLine: "underline"}}
                />

                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setupMeter()}>
                    <Text style={styles.textStyle}>Add Device</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAddMeterVisible(!addMeterVisible)}>
                    <Feather name="x" size={24} color="black"/>
                  </TouchableOpacity>
                </View>
                
              </View>
            </View>
          </Modal>

          <View style={styles.header}>
            <View style={{flex: 1, justifyContent: "center", alignItems: "flex-start", marginLeft: 10}}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                  <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={{flex: 2, alignItems: "center", justifyContent: "center"}}>
              <Text style={{color: "white"}}>Meters</Text>
            </View>

            <View style={{flex: 1, alignItems: "flex-end", justifyContent: "center", marginRight: 10}}>
                <TouchableOpacity onPress={() => setAddMeterVisible(!addMeterVisible)}>
                  <Entypo name="plus" size={24} color="white" />            
                </TouchableOpacity>
            </View>
          </View>

          <View style={styles.list}>
          <FlatList
                data={meters}
                renderItem={({item}) => <Item data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
          </View>
        </View>
    )
}