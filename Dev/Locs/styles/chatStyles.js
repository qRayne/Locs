import { StyleSheet } from "react-native";

const chatStyles = StyleSheet.create({

    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#355fd4"
    },

    logo:{
        width: 50,
        height: 50
    },

    collapsedChat:{
        flex: 6
    },

    avatar:{
        height:20,
        width:20
    },

    chatbox:{
        flex: 6,
        width: 375,
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: "#2548a7",
        justifyContent: "flex-end",
        padding: 10
    },

    chatInput:{
        backgroundColor: '#2b55ca',
        alignSelf: 'center',
        borderRadius: 10,
        width: "100%",
        margin: 7,
        padding: 5,
        color: 'white'
    },

    centerText:{
        margin: 5,
        alignSelf: "center",
        textAlign: "center"
    }
});

  export default chatStyles;