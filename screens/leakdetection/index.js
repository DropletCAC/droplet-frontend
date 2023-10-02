import * as React from 'react';
import { View, ScrollView, StyleSheet, Image, Touchable, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, Card, Button, Icon } from '@rneui/themed';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import styles from "./styles"
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 

export default function LeakDetection() {
    const navigation = useNavigation()
    const [leaks, setLeaks] = useState([])

    useEffect(() => {
      const unsubscribe =
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("leaks")
          .onSnapshot(querySnapshot => {
            const newDocs = []

            querySnapshot.forEach(documentSnapshot => {
              console.log(documentSnapshot.id, documentSnapshot.data())
              data = documentSnapshot.data()
              data.date = new Date(data.date.seconds * 1000)
              data.id = documentSnapshot.id
              newDocs.push(data)
            })

            setLeaks(newDocs)
          })
      

      return () => {
        unsubscribe()
      }
    }, []);

    async function deleteLeak() {
      console.log("Deleting", data)
      await firebase 
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("leaks")
        .doc(data.id)
        .delete();
    }

    const Item = ({data}) => (
      <View>
        <Card containerStyle={styles.item}>
            <Card.Title>Leak Detected</Card.Title>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <View>
                <Text>Leak Detected In: "{data.section}"</Text>
                <Text>On {data.date.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</Text>
                <Text>
                  <Text>Unusual usage of </Text>
                  <Text style={{fontWeight: "bold"}}>{data.usage}</Text>
                  <Text> gallons</Text>
                </Text>
              </View>

                <TouchableOpacity onPress={() => deleteLeak(data)}>
                    <Text>Dismiss</Text>
                </TouchableOpacity>
            </View>
        </Card>
      </View>


    );

    if (leaks) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{flex: 1, justifyContent: "center", alignItems: "flex-start", marginLeft: 10}}>
                  <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                  </TouchableOpacity>
              </View>

              <View style={{flex: 2, alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "white"}}>Leaks</Text>
              </View>

              <View style={{flex: 1}} />

          </View>
            <FlatList style={styles.list}
                data={leaks}
                renderItem={({item}) => <Item data={item} />}
            />
        </View>
       )
    }
}
