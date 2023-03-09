import { StyleSheet } from "react-native";

const loginStyles = StyleSheet.create({
    container: {
      fontFamily: "Galdeano-Regular",
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    title:{
      fontSize: 50
    },
  
    inputbox: {
      backgroundColor: '#3C746F',
      alignItems: 'center',
      justifyContent: 'center',
      width: 250,
      margin: 7,
      padding: 5,
      color: 'white'
    }
  });

  export default loginStyles;