import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },
    
    list: {
        flex: 1,
        marginTop: 50, 
    },

    text: {
        color: "black"
    },
    
    item: {
        borderRadius: 10,
        borderWidth: 10,  
        backgroundColor: "white",
        borderColor: "white", 
    },

    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
      },
  
  })
  
export default styles;