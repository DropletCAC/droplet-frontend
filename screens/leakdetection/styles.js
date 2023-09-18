import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },
    
    list: {
        flex: 1,
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
    
    header: {
        flex: 0.05,
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 50, 
        alignContent: 'center',   
    }
  })
  
export default styles;