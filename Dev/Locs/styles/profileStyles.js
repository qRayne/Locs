import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const profileStyles = StyleSheet.create({
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

    toprow:{
      // backgroundColor: "black"
    },

    circle:{
      width: 150,
      height:150,
      borderRadius: 150/2,
    }
  });

  export default profileStyles;