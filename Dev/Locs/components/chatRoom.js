import { useState, useEffect } from 'react';
import { createChatRoom } from './newChatroom';
import { Pressable, Text, TextInput, View, Modal, Image, Alert, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';
import chatStyles from '../styles/chatStyles';
import jwtDecode from 'jwt-decode';

const { possibleAvatars } = require('./constNames');
const { URL } = require('./constNames.js');

export default function Chatroom({ navigation, route }) {
  const [chat, setChat] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentlySelectedUser, setCurrentlySelectedUser] = useState("");
  const [isPublicChatroom, setIsPublicChatroom] = useState('');
  const chatRoomName = route.params.chatRoomName;
  const chatRoomType = route.params.chatRoomType;
  const chatRoomAdress = route.params.chatRoomTypeAdress;
  const nearestLocation = route.params.nearestLocation; // true or false;

  async function sendChat() {
    const token = await AsyncStorage.getItem('token');

    // il peut send des chats seulements s'il est dans le lieu
    if (token) {
      if (nearestLocation) {
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
      else{
        Alert.alert('Rend-toi au Loc pour Chatter');
      }
    }
    else {
      Alert.alert('Sending Message Failed', 'Login to chat');
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
        if (messageResponse === "The chatroom doesn't exist") {
          const chatRoom = { placeName: chatRoomName, coordinate: { latitude: 0, longitude: 0 }, isPublic: false };
          await createChatRoom(chatRoom);
        }
        navigation.navigate('ChatRoom', {
          chatRoomName: chatRoomName, chatRoomType: "Private chat between " + username + " and " + currentlySelectedUser,
          chatRoomTypeAdress: "",nearestLocation:true
        });
      }
    }
  }

  useEffect(() => {
    async function fetchChatMessages() {
      try {
        // Fetch the chat messages
        const messagesResponse = await fetch(`${URL}/chatRoom-messages?name=` + encodeURIComponent(chatRoomName));
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
  }, [chatRoomName]);

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
        {/* <Image source={{ uri : icon}}></Image> */}
        <Text style={globalStyles.subtitle}>{chatRoomName}</Text>
        {/* <Text> {chatRoom.adress}</Text> */}
        <Text> {chatRoomType}</Text>
        <Text> {chatRoomAdress}</Text>
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