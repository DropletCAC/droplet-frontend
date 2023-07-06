import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { FlatList, ActivityIndicator, View, Text, Pressable } from 'react-native';
import styles from "./styles";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";


export default function Meters() {
    const navigation = useNavigation()
    const [meters, setMeters] = useState([])
    const today = new Date();

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
            <FlatList style={styles.list}
                data={meters}
                renderItem={({item}) => <Item data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </View>
    )
}