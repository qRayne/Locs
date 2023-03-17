import { useState, useEffect } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal, Image } from 'react-native';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SelectList } from 'react-native-dropdown-select-list'
import globalStyles from '../styles/globalStyles';
import chatStyles from '../styles/chatStyles';
const {IP}  = require('./constNames.js')


export default function Chatroom({ navigation }) {
  const [chat, setChat] = useState('');
  const [text, setText] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  function chatInput(enteredText) {
    setChat(enteredText);
  }

  async function sendChat() {
    const token = await AsyncStorage.getItem('token');
    const decoded = jwtDecode(token);
    const username = decoded.username

    // remplacer le nom du chatroom par le context
    // ici faut changer l'ip par l'ip de ton ordinateur
    fetch(`${IP}/chatroom-sendChat/McDonald`, {
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

  useEffect(() => {
    async function fetchChatMessages(chatroomName) {
      try {
        // ici faut changer l'ip par l'ip de ton ordinateur
        const response = await fetch(`${IP}/chatRoom-messages?name=` + encodeURIComponent(chatroomName));
        const data = await response.json();
        setChatMessages(data);
      } catch (error) {
        console.error(error);
      }
    }

    // on doit creer la location si elle n'existe pas
    fetchChatMessages("McDonald"); // ici on passe le context/nom de la location 
  }, []);

  return (
    <View style={globalStyles.container}>
      <View style={chatStyles.infoBox}>
        {/* TODO: use context to pass along the name of the location */}
        <Image></Image>
        <Text style={globalStyles.subtitle}>McDonald's</Text>
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
            // value={chat}
            onChangeText={chatInput}
            onSubmitEditing={sendChat}
          >

          </TextInput>
        </View>
      </View>

      <Pressable
        onPressIn={() => {
          console.log("move to register screen");
          navigation.navigate('Login');
        }}>
        <Text style={globalStyles.register}> Logout? </Text>
      </Pressable>
    </View>
  );
}
