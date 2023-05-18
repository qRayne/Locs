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
  const chatRoomDesc = route.params.chatRoomDesc;
  const nearestLocation = route.params.nearestLocation; // true or false;
  const previousPage = route.params.previousPage;

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
            Alert.alert('Server error');
            navigation.navigate(previousPage);
          });

        // Clear the chat input
        setChat('');
      }
      else {
        Alert.alert('Rend-toi au Loc pour Chatter');
        navigation.navigate(previousPage);
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
        if (messageResponse === "The chatroom does not exist") {
          const chatRoom = { placeName: chatRoomName, coordinate: { latitude: 0, longitude: 0 } };
          await createChatRoom(chatRoom, false);
        }
        navigation.navigate('ChatRoom', {
          chatRoomName: chatRoomName, chatRoomType: "Private chat",
          chatRoomTypeAdress: "", nearestLocation: true, previousPage: 'ChatRoom'
        });
      }
    }
  }

  async function delocUsers() {
    const token = await AsyncStorage.getItem('token');

    // vue que alert est une fonction async
    // il faut lui "promettre" une valeur de retour
    const wannaDeloc = await new Promise((resolve) => {
      Alert.alert('Deloc', 'Are you sure you want to DeLoc ' + currentlySelectedUser + "?\n all your private information will be shared with them", [
        {
          text: 'NO',
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: 'YES',
          onPress: () => resolve(true),
        },
      ]);
    });

    if (wannaDeloc) {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const username = decoded.username;

          const response = await fetch(`${URL}/delocs-betweenUsers?currentUsername=` + encodeURIComponent(username) +
            `&selectedUsername=` + encodeURIComponent(currentlySelectedUser));

          switch (response.status) {
            case 200:
              Alert.alert('DeLoc successful ' + currentlySelectedUser)
              break;
            case 400:
              Alert.alert("You have already DeLoc'd:" + currentlySelectedUser)
              break;
          }
          navigation.navigate('Profile');
        } catch (error) {
          console.error(error);
        }
      }
      else {
        Alert.alert('Sending Message Failed', 'Login to DeLoc');
        navigation.navigate('Login');
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
    <View style={chatStyles.container}>
      <Text style={globalStyles.subtitle}>{chatRoomName}</Text>
      {chatRoomDesc
        ? <Text style={globalStyles.font}> {chatRoomDesc}</Text>
        : <Text style={globalStyles.font}> {chatRoomType.replace(/_/gm, " ")}</Text>
      }
      <Text style={globalStyles.font}> {chatRoomAdress}</Text>

      <View style={chatStyles.chatbox}>
        <FlatList
          data={chatMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setCurrentlySelectedUser(item.sender)}>
              <View style={globalStyles.row}>
                <View style={globalStyles.column}>
                  <View style={globalStyles.row}>
                    <Image source={possibleAvatars[item.avatar]} style={chatStyles.avatar} />
                    <Text style={globalStyles.bold}> {item.sender}</Text>
                    <Text style={globalStyles.faded}>{item.timestamp.toString()}</Text>
                  </View>
                  {/* like a row */}
                  <View style={globalStyles.row}>
                    <Text style={globalStyles.espace}>{item.message}</Text>
                  </View>
                </View>
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

      <View style={globalStyles.row}>
        {isPublicChatroom 
        ? (
          <View style={globalStyles.row}>
            <Pressable onPressIn={() => { goToChatPrivate(); }}>
              <Text style={chatStyles.centerText}> Start private chat </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {currentlySelectedUser ? (
              <Pressable onPressIn={() => { delocUsers(); }}>
                <Text> Deloc {currentlySelectedUser}? </Text>
              </Pressable>
            ) : (
              null
            )}
          </>
        )}
        <Pressable
          onPressIn={() => {
            logout();
          }}>
          <Text style={chatStyles.centerText}> Logout? </Text>
        </Pressable>
      </View>
    </View>
  );
}