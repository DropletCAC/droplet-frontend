import * as React from 'react';
import {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Button, Dimensions} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";


export default function TestPage({route}) {
    const params = route.params
    return (
        <View>
            <Text>{JSON.stringify(params)}</Text>
        </View>
    )
}