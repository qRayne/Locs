import { useState, useEffect } from 'react';
import { Pressable, Text, TextInput, View, Modal, Image, Alert, FlatList, TouchableOpacity } from 'react-native';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';
import chatStyles from '../styles/chatStyles';
const { URL } = require('./constNames.js');
import { createChatRoom } from './newChatroom';
const { possibleAvatars } = require('./constNames');



export default function Chatroom({ navigation, route }) {
  const [chat, setChat] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentlySelectedUser, setCurrentlySelectedUser] = useState("");
  const [isPublicChatroom, setIsPublicChatroom] = useState('');
  const chatRoom = route.params.chatRoom;
  const icon = route.params.icon;

  console.log(chatRoom.adress);

  async function sendChat() {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const username = decoded.username;

      // remplacer le nom du chatroom par le context
      fetch(`${URL}/chatroom-sendChat/` + chatRoom.name, {
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

  async function goToChatPrivate() {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const username = decoded.username;
      if (username !== currentlySelectedUser && currentlySelectedUser !== "") {
        const chatRoomName = [username, currentlySelectedUser].sort().join('_');
        const response = await fetch(`${URL}/check-privateChatroom?name=` + encodeURIComponent(chatRoomName));
        const messageResponse = await response.text();
        if (messageResponse === "The chatroom doesnt exist") {
          const chatRoom = { name: chatRoomName, location: { latitude: 192.123, longitude: 123 }, isPublic: false };
          await createChatRoom(chatRoom);
        }
        navigation.navigate('ChatRoom', { chatRoom: chatRoomName });
      }
    }
  }

  useEffect(() => {
    async function fetchChatMessages() {
      try {
        // Fetch the chat messages
        const messagesResponse = await fetch(`${URL}/chatRoom-messages?name=` + encodeURIComponent(chatRoom.name));
        const messagesData = await messagesResponse.json();
        setChatMessages(messagesData.messageHistory);
        setIsPublicChatroom(messagesData.isPublic);
      } catch (error) {
        console.error(error);
      }
    }

    fetchChatMessages();

    const interval = setInterval(() => {
      fetchChatMessages();
    }, 1000);

    return () => clearInterval(interval);
  }, [chatRoom.name]);

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
        <Image source={{ uri : icon}}></Image>
        <Text style={globalStyles.subtitle}>{chatRoom.name}</Text>
        <Text> {chatRoom.adress}</Text>
        <Text> lorem ipsum </Text>
        <Text> lorem ipsum </Text>
      </View>

      {/* barre de texte */}
      <View style={chatStyles.chatbox}>
        <FlatList
          data={chatMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setCurrentlySelectedUser(item.sender)}>
              <View style={globalStyles.row}>
                <Image source={possibleAvatars[item.avatar]} style={chatStyles.avatar} />
                <Text>
                  username: {item.sender} message: {item.message} {item.timestamp}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
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

      <View>
        {isPublicChatroom ? (
          <View style={globalStyles.row}>
            <Pressable onPressIn={() => { goToChatPrivate(); }}>
              <Text>Start private chat</Text>
            </Pressable>
          </View>
        ) : null}
        <Pressable
          onPressIn={() => {
            logout();
          }}>
          <Text style={globalStyles.register}> Logout? </Text>
        </Pressable>
      </View>
    </View>
  );
}