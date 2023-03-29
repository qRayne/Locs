import { useState, useEffect } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal, Image } from 'react-native';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
// import { SelectList } from 'react-native-dropdown-select-list'
import globalStyles from '../styles/globalStyles';
import chatStyles from '../styles/chatStyles';
const { IP } = require('./constNames.js');


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
      // ici faut changer l'ip par l'ip de ton ordinateur
      fetch(`${IP}/chatroom-sendChat/` + chatRoomName, {
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
      console.log('the user need to be connected to send to the chatroom');
    }

  }

  useEffect(() => {
    async function fetchChatMessages() {
      try {
        // Fetch the chat messages
        const messagesResponse = await fetch(`${IP}/chatRoom-messages?name=` + encodeURIComponent(chatRoomName));
        const messagesData = await messagesResponse.json();
        setChatMessages(messagesData);
      } catch (error) {
        console.error(error);
      }
    }

    const interval = setInterval(() => {
      fetchChatMessages();
    }, 1000); // update chat messages every 1 second

    // cleanup function to clear the interval when the component unmounts
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
          <View key={index}>
            {/* il faudrait changer le visuel pour que sa soit plus beau */}
            <Text>username : {message.sender} message : {message.message} {message.timestamp}</Text>
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
