import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal, Image } from 'react-native';
// import { SelectList } from 'react-native-dropdown-select-list'
import globalStyles from '../styles/globalStyles';
import chatStyles from '../styles/chatStyles';


export default function Chatroom({navigation}) {
    const [chat, setChat] = useState('');
    const [text, setText] = useState([]);

    function chatInput(enteredText){
        setChat(enteredText);
    }

    function addChat(text){
        setText((currentText) => [
            ...currentText, 
            chat,
        ]);
    }

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
            {text.map((chat) => 
                <Text key={Math.random()}> 
                    {chat} 
                </Text>
            )}
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
