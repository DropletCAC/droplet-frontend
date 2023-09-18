import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },
    
    list: {
        flex: 0.9,
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

      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },

      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        paddingHorizontal: 100,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },

      button: {
        borderRadius: 20,
        padding: 10,
        margin: 5,
        elevation: 2,
      },

      buttonOpen: {
        backgroundColor: 'black',
      },

      buttonClose: {
        backgroundColor: 'black',
      },

      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      
      modalText: {
        textAlign: 'center',
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