import { useState,useEffect } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal, Image } from 'react-native';
// import { SelectList } from 'react-native-dropdown-select-list'
import globalStyles from '../styles/globalStyles';
import chatStyles from '../styles/chatStyles';


export default function Chatroom({ navigation }) {
  const [chat, setChat] = useState('');
  const [text, setText] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);


  function chatInput(enteredText) {
    setChat(enteredText);
  }

  function addChat(text) {
    setText((currentText) => [
      ...currentText,
      chat,
    ]);
  }

  useEffect(() => {
    async function fetchChatMessages(chatroomName) {
      try {
        // ici faut changer l'ip par l'ip de ton ordinateur
        const response = await fetch('http://192.168.2.20:3000/chatRoom-messages?name='+ encodeURIComponent(chatroomName));
        const data = await response.json();
        setChatMessages(data);
      } catch (error) {
        console.error(error);
      }
    }

    // on doit creer la location si elle n'existe pas
    fetchChatMessages("McDonald's"); // ici on passe le context/nom de la location 
  },[]);

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
        {chatMessages.map((message,index)=>(
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
            onSubmitEditing={addChat}
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
