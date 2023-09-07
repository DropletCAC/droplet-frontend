import * as React from 'react';
import { View, ScrollView, StyleSheet, Image, Touchable, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, Card, Button, Icon } from '@rneui/themed';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import styles from "./styles"

export default function LeakDetection() {

    [leaks, setLeaks] = useState([])

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
        <Card>
            <Card.Title>Leak Detected</Card.Title>
            <Card.Divider />
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <View>
                <Text>Leak detected in "{data.section}"</Text>
                <Text>On {data.date.toLocaleString("en-GB")}</Text>
                <Text>Used {data.usage} gallons</Text>
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
            <FlatList style={styles.list}
                data={leaks}
                renderItem={({item}) => <Item data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </View>
       )
    }
}
