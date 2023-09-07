import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: "rgb(22, 23, 24)",
    },
  
    graph: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      marginRight: 15,
      marginTop: 50,
    },
  
    header: {
      backgroundColor: "rgb(22, 23, 24)",
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1,
      flexDirection: "row",
      marginTop: 50,
      flex: 0.5,
    },
  
    text: {
      backgroundColor: "rgb(22, 23, 24)",
    },
    

  })

export default styles;