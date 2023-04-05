import { StyleSheet } from "react-native";

const chatStyles = StyleSheet.create({

    logo:{
        width: 50,
        height: 50
    },

    infoBox:{

    },

    collapsedChat:{
        flex: 6
    },

    openedChat:{

    },

    avatar:{
        height:20,
        width:20
    },

    chatbox:{
        flex: 1,
        width: 375,
        borderColor: "black",
        borderWidth: 2,
        backgroundColor: "lightgrey",
        justifyContent: "flex-end",
        padding: 10
    },

    chatInput:{
        backgroundColor: '#3C746F',
        alignSelf: 'center',
        borderRadius: 10,
        width: "100%",
        margin: 7,
        padding: 5,
        color: 'white'
    }
});

  export default chatStyles;