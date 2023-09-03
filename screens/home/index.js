import * as React from 'react';
import {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";


export default function Home() {
  const navigation = useNavigation()
  const today = new Date();
  
  async function handleUsage() {
    const snap = await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("usage")
    .doc(today.getFullYear().toString())
    .get()

    navigation.navigate("Usage", {"data": snap.data()})

  }

  return (
      <View style={styles.container}>
        <View style={styles.text_container}>
          <Text style={styles.text}>Current Usage</Text>
        </View>

        <View>
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
                <Text style={styles.button_text}>Leak Detection</Text>
                <View style={styles.icon}>
                  <Icon name="arrow-right" size={12} color="white"/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Page2')}>
                  <Text style={styles.button_text}>Settings</Text>
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
    flex: 1,
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

  text_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },

  text: {
    color: 'white',
  }
});