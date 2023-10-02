import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },
    
    list: {
        flex: 1,
    },
    item: {
        borderRadius: 15,
        backgroundColor: "white",
        borderColor: "white", 
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
    }
  })
  
export default styles;