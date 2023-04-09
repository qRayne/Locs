import { useState, useEffect } from 'react';
import { Pressable, Text, TextInput, View, Modal, Image, Alert } from 'react-native';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';
import chatStyles from '../styles/chatStyles';
const { URL } = require('./constNames.js');
const {possibleAvatars} = require('./constNames');



export default function Chatroom({ navigation, route }) {
  const [chat, setChat] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatRoomName = route.params.chatRoom;

  async function sendChat() {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const username = decoded.username;

      // remplacer le nom du chatroom par le context
      fetch(`${URL}/chatroom-sendChat/` + chatRoomName, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: username, // fixed, on recupère le token qui lui en le decodant => username
          message: chat,
          timestamp: new Date().toString()
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });

      // Clear the chat input
      setChat('');
    }
    else {
      Alert.alert('Sending Message Failed', 'the user need to be connected to send to the chatroom');
      navigation.navigate('Login');
    }
  }

  useEffect(() => {
    async function fetchChatMessages() {
      try {
        // Fetch the chat messages
        const messagesResponse = await fetch(`${URL}/chatRoom-messages?name=` + encodeURIComponent(chatRoomName));
        const messagesData = await messagesResponse.json();
        setChatMessages(messagesData);
      } catch (error) {
        console.error(error);
      }
    }

    const interval = setInterval(() => {
      fetchChatMessages();
    }, 1000);


    return () => clearInterval(interval);

  }, []);

  // ici pas besoin d'une route pour se logout
  // juste d'enlever tous les async storage que le user connecter a
  async function logout() {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("user_id");
    navigation.navigate('Login');
  }

  return (
    <View style={globalStyles.container}>
      <View style={chatStyles.infoBox}>
        {/* TODO: use context to pass along the name of the location */}
        <Image></Image>
        <Text style={globalStyles.subtitle}>{chatRoomName}</Text>
        <Text> lorem ipsum </Text>
        <Text> lorem ipsum </Text>
        <Text> lorem ipsum </Text>
      </View>

      {/* barre de texte */}
      <View style={chatStyles.chatbox}>
        {chatMessages.map((message, index) => (
          <View 
            key={index}
            style={globalStyles.row}
          >
            {/* il faudrait changer le visuel pour que sa soit plus beau */}
            <Image source={possibleAvatars[message.avatar]} style={chatStyles.avatar} />
            <Text> username : {message.sender} message : {message.message} {message.timestamp}</Text>
          </View>
        ))}
        <View>
          <TextInput
            style={chatStyles.chatInput}
            value={chat}
            onChangeText={(text) => setChat(text)}
            onSubmitEditing={sendChat}
          >
          </TextInput>
        </View>
      </View>

      <Pressable
        onPressIn={() => {
          logout();
        }}>
        <Text style={globalStyles.register}> Logout? </Text>
      </Pressable>
    </View>
  );
}
