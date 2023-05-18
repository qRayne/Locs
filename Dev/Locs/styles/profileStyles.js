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
      position: 'absolute',
      right: 25,
      top: 42,
    },

    circle:{
      width: 150,
      height:150,
      borderRadius: 150/2,
    },

    box:{
      borderRadius: 20,
      backgroundColor:'#e8edfc',
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "red"
    }
  });

  export default profileStyles;