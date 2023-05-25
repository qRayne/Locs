import { Pressable, Text, View, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react';
import globalStyles from '../styles/globalStyles';
import Profile from './profile';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Deloc({ navigation, route }) {

  const privateMessageList = route.params.pm;
  const [username, setUsername] = useState('');

  useEffect(() => {
    getUsername().then(name => setUsername(name));
  }, []);

  function redirectToPrivateRoom(chatroom) {
    navigation.navigate('ChatRoom', {
      chatRoomName: chatroom.place.name,
      chatRoomType: "Private chat",
      chatRoomTypeAdress: "",
      nearestLocation: true,
      previousPage: 'Profile'
    });
  }

  async function getUsername() {
    const token = await AsyncStorage.getItem('token');
    let currentConnectedUser = "";
    if (token) {
      const decoded = jwtDecode(token);
      currentConnectedUser = decoded.username;
    }
    return currentConnectedUser;
  }

  function filterName(chatroomName){
    const names = chatroomName.split('_');
    otherPersonName = names.filter(name => name !== username).join('_');      
    return otherPersonName;
  }


  // pour une liste de message plus detaillée (pas necesairement ceux qui sont deloc), avec leur avatar et le dernier message envoyé
  return (
    <View style={globalStyles.container}>
      {privateMessageList && privateMessageList.length > 0
        ? (<>
          {privateMessageList.map((chatroom, index) => (
            <TouchableOpacity key={index}
              onPress={() => redirectToPrivateRoom(chatroom)}>
              <Text style={globalStyles.undertext}>
                {filterName(chatroom.place.name)}
              </Text>
            </TouchableOpacity>
          ))}
        </>)
        : (<Text> No private message rooms found </Text>)}

      <Pressable
        style={globalStyles.button}
        onPressIn={() => {
          console.log("go back");
          navigation.navigate('Home', { screen: "Profile" });
        }}>
        <Text style={globalStyles.text}> Back </Text>
      </Pressable>
    </View>
  );
}
