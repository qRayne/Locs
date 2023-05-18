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
      fontFamily: 'Galdeano_400Regular'
    },

    logo:{
      width: 250,
      height: 150
    },

    bot:{
      paddingBottom: 20,
      backgroundColor: "#fff"
    },
  
    title:{
      fontSize: 50,
      marginBottom: 15,
      textAlign: 'center'
    },

    subtitle:{
      marginTop: 40,
      fontSize: 35,
      fontFamily: 'Galdeano_400Regular'
    },

    undertext:{
      fontSize: 25,
      fontFamily: 'Galdeano_400Regular',
    },

    bold:{
      fontWeight: "bold",
      fontSize: 20,
      marginRight: 10,
      fontFamily: 'Galdeano_400Regular',
    },

    espace:{
      marginLeft: 25,
      fontFamily: 'Galdeano_400Regular',
      fontSize: 18
    },

    faded:{
      opacity:  0.5,
      fontFamily: 'Galdeano_400Regular',
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

    absolute:{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 100,
    },
  
    inputbox: {
      fontFamily: 'Galdeano_400Regular',
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
      fontFamily: 'Galdeano_400Regular',
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
      color: 'white',
      fontFamily: 'Galdeano_400Regular',
    },

    text2:{
      // color: 'white',
      fontSize: 20,
      fontFamily: 'Galdeano_400Regular',
    },

    font:{
      fontFamily: 'Galdeano_400Regular',
    },

    register:{
      marginTop: 15,
      fontFamily: 'Galdeano_400Regular',
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
    },

    icon:{
      width: 50,
      height: 50
    }

  });

  export default globalStyles;