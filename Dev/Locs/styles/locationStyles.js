import { StyleSheet } from "react-native";

const locationStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    title:{
      fontSize: 50,
      marginBottom: 15,
    },

    map:{
      flex: 1,
      width: 720,
      height:480
    }
  });

  export default locationStyles;