import { StyleSheet } from "react-native"; 
import { Colors } from "react-native/Libraries/NewAppScreen";

const globalStyles = StyleSheet.create({


    // PALETTE 
    //    Blue:          #5578DA
    //    Raisin Black:  #272932
    //    Tomato:        #FE4A49
    //    Mustard:       #FED766
    //    Platinum:      #E6E6EA

    container: {
      flex: 1,
      backgroundColor: '#bccaf5',
      alignItems: 'center',
      justifyContent: 'center',
      // fontFamily: 'Galdeano-Regular'
    },

    logo:{
      width: 250,
      height: 150
    },
  
    title:{
      fontSize: 50,
      marginBottom: 15,
      textAlign: 'center'
    },

    subtitle:{
      marginTop: 40,
      fontSize: 35
    },

    undertext:{
      fontSize: 25
    },

    bold:{
      fontWeight: "bold",
      fontSize: 18,
      marginRight: 10
    },

    espace:{
      marginLeft: 25
    },

    faded:{
      opacity:  0.5,
    },

    row:{
      flexDirection: "row",
      alignItems: "center"
    },

    column:{
      flexDirection: "column",
      // justifyContent: "center",
      // alignItems: "center"
    },
  
    inputbox: {
      backgroundColor: '#2b55ca',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      width: 250,
      margin: 7,
      padding: 5,
      color: 'white'
    },

    button:{
      backgroundColor: "#5578DA",
      width:100,
      height: 30,
      flex:-1,
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center', 
      borderRadius: 10
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
      marginTop: 22
    },

    centeredProp:{
      alignSelf:"center",
      marginBottom: 15
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

    circle:{
      width: 85,
      height:85,
      borderRadius: 100/2,
      borderWidth:2,
      backgroundColor: "light-grey"
    }

  });

  export default globalStyles;