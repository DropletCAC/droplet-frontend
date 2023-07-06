import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },
    
    list: {
        flex: 1,
        margin: 20,
        marginTop: 80
    },
    meter_pressable: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between' 
    },

    text: {
        color: "white"
    },

    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
      },

})

export default styles;