import { StyleSheet } from "react-native"; 

const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Galdeano-Regular'
    },
  
    title:{
      fontSize: 50,
      marginBottom: 15,
      textAlign: 'center'
    },

    subtitle:{
      fontSize: 40,
    },

    undertext:{
      fontSize: 25
    },

    row:{
      flexDirection: "row"
    },
  
    inputbox: {
      backgroundColor: '#3C746F',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      width: 250,
      margin: 7,
      padding: 5,
      color: 'white'
    },

    button:{
      backgroundColor: "#000",
      width:75,
      height: 30,
      flex:-1,
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center', 
      borderRadius: 10,
    },

    text:{
      color: 'white'
    },

    register:{
      marginTop: 15
    },

    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },

    centeredProp:{
      alignSelf:"center"
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
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },

  });

  export default globalStyles;