import * as React from 'react';
import {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList} from 'react-native';
import { Card, Button, Icon } from '@rneui/themed';
import { useNavigation, useNavigationState } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import styles from "./styles"
import { Ionicons } from '@expo/vector-icons'; 

export default function Tips({route}) {
    const [tips, setTips] = useState([])
    const navigation = useNavigation()
    
    useEffect(() => {
        const unsubscribe =
          firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("tips")
            .onSnapshot(querySnapshot => {
              const newDocs = []
  
              querySnapshot.forEach(documentSnapshot => {
                console.log(documentSnapshot.id, documentSnapshot.data())
                data = documentSnapshot.data()
                data.date = new Date(data.date.seconds * 1000)
                data.id = documentSnapshot.id
                newDocs.push(data)
              })
  
              setTips(newDocs)
            })
        
  
        return () => {
          unsubscribe()
        }
      }, []);
  
      async function deleteTip() {
        console.log("Deleting", data)
        await firebase 
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("tips")
          .doc(data.id)
          .delete();
      }
  
      const Item = ({data}) => (
        <View>
          <Card containerStyle={styles.item}>
            <View>
                <Text style={{fontSize: 15}}>{data.content}</Text>
                <View style={{justifyContent: "space-between", flexDirection: "row", marginTop: 5}}>
                    <Text style={{fontSize: 12}}>{data.date.toDateString()}</Text>
                        <TouchableOpacity onPress={() => deleteTip(data)}>
                        <Text style={{fontSize: 12}}>Dismiss</Text>
                        </TouchableOpacity>                 
                </View>
            </View>
          </Card>
        </View>
  
  
      );
  
      if (tips) {
        return (
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={{flex: 1, justifyContent: "center", alignItems: "flex-start", marginLeft: 10}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                      <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
  
                <View style={{flex: 2, alignItems: "center", justifyContent: "center"}}>
                  <Text style={{color: "white"}}>Tips</Text>
                </View>
  
                <View style={{flex: 1}} />
  
            </View>
              <FlatList style={styles.list}
                  data={tips}
                  renderItem={({item}) => <Item data={item} />}
              />
          </View>
         )
      }
}