import { useState, useEffect } from 'react';
import { Pressable, Text, TextInput, View, Alert, Image, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';
import Profile from './profile';

export default function Deloc({ navigation, route }) {

  const privateMessageList = route.params.pm;

  function redirectToPrivateRoom(chatroom) {
    // vu que le nom du chatroom est egalement les deux noms d'utilisateurs on doit voir tout ce qu'on a en private messages
    // soi nous meme et les autres
    navigation.navigate('ChatRoom', {
        chatRoomName: chatroom.place.name, chatRoomType: "Private chat",
        chatRoomTypeAdress: "", nearestLocation: true, previousPage: 'Profile'
    });
}
// pour une liste de message plus detaillée (pas necesairement ceux qui sont deloc), avec leur avatar et le dernier message envoyé
  return (
    <View style={globalStyles.container}>
      {privateMessageList && privateMessageList.length > 0
        ? (<>
            {privateMessageList.map((chatroom, index) => (
                <TouchableOpacity key={index} onPress={() => redirectToPrivateRoom(chatroom)}>
                    <Text style={globalStyles.undertext}>
                        {chatroom.place.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </>)
        : (<Text> No private message rooms found </Text>)}

      <Pressable
        style={globalStyles.button}
        onPressIn={() => {
          console.log("go back");
          navigation.navigate('Home', {screen: "Profile"});
        }}>
        <Text style={globalStyles.text}> Back </Text>
      </Pressable>
    </View>
  );
}
