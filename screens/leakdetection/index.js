import * as React from 'react';
import { View, ScrollView, StyleSheet, Image, Touchable, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
// Sample data
const users = [
    {
      name: 'brynn',
      avatar: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
    },
    {
      name: 'thot leader',
      avatar:
        'https://images.pexels.com/photos/598745/pexels-photo-598745.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb',
    },
    {
      name: 'jsa',
      avatar: 'https://uifaces.co/our-content/donated/bUkmHPKs.jpg',
    },
    {
      name: 'talhaconcepts',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      name: 'andy vitale',
      avatar: 'https://uifaces.co/our-content/donated/NY9hnAbp.jpg',
    },
    {
      name: 'katy friedson',
      avatar:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTgxMTc1MTYzM15BMl5BanBnXkFtZTgwNzI5NjMwOTE@._V1_UY256_CR16,0,172,256_AL_.jpg',
    },
    ];
    
export default function LeakDetection() {
    return (
        <View style={{marginTop: 50}}>
            <Card>
                <Card.Title>Leak Detected</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text>Word</Text>
                    <TouchableOpacity>
                        <Text>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </Card>
            <Card>
                <Card.Title>Leak Detected</Card.Title>
                <Card.Divider />
               <Text>Word</Text>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    fonts: {
      marginBottom: 8,
    },
    user: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    image: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    name: {
      fontSize: 16,
      marginTop: 5,
    },
    });