import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: "rgb(22, 23, 24)",
    },
  
    graph: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginRight: 30,
      marginLeft: 20
    },
    
    cost: {
      flex: 0.5,
    },

    header: {
      backgroundColor: "rgb(22, 23, 24)",
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: "row",
      marginTop: 40,
      flex: 0.5,
      zIndex: 1,
    },
  
    text: {
      backgroundColor: "rgb(22, 23, 24)",
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
      alignItems: 'center',
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
      paddingHorizontal: 20,
      elevation: 2,
      backgroundColor: "black"
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },

    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      paddingHorizontal: 50
    },

  })

export default styles;