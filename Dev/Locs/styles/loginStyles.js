import { StyleSheet } from "react-native";

const loginStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    title:{
      fontSize: 50,
      marginBottom: 25
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
    }
  });

  export default loginStyles;