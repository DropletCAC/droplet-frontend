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
        borderRadius: 15,
        backgroundColor: "rgb(220, 220, 220)",
        borderWidth: 0,
    },

    inner_item: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center"
    },

    header: {
        flex: 0.05,
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 50, 
        alignContent: 'center',   
    },

    header_text: {
        flex: 2, 
        alignItems: "center", 
        justifyContent: "center"
    },

    back_button: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "flex-start", 
        marginLeft: 10
    }
  })
  
export default styles;