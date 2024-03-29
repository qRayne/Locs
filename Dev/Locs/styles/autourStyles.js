import { StyleSheet } from "react-native";

const autourStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: "flex-start",
    },

    title:{
        fontSize: 50,
        textAlign: 'center'
    },

    collapsedBox:{
        width: 375,
        height: 75,
        // borderColor: "black",
        // borderWidth: 2,
        backgroundColor: "#8fa8f0",
        padding: 10,
        borderRadius: 25,
        fontSize: 25,
        alignItems: "center",
        justifyContent: "center"
    },

    subtitle:{
        fontSize: 18,
        fontFamily: 'Galdeano_400Regular',
    },

    km:{
        backgroundColor: '#3C746F',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 75,
        margin: 7,
        padding: 5,
        fontSize: 15,
        color: 'white',
        justifyContent: "center"
    },

    centerText:{
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: 20
    },

    row:{
        justifyContent: "space-between",
        flexDirection: "row"
    },

    profile:{
        marginTop: 40,
        width: 40,
        height: 40,
        borderRadius: 100/2,
        borderWidth:2,
        backgroundColor: "light-grey",
    },

    loading:{
        flex: 1,
        justifyContent: 'center' 
    }

  });

  export default autourStyles;