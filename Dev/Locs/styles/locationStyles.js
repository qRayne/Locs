import { StyleSheet } from "react-native";

const locationStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
  
    title:{
      fontSize: 50,
      marginBottom: 15
    },

    map:{
      flex: 1,
      width: 720,
      height:480
    },

    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3
    },

    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: 22
    },

    absolute:{
      position: 'absolute',
      left: 0,
      top: 100,
    }


  });

  export default locationStyles;