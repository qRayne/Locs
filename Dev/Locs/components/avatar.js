import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import avatarStyles from '../styles/avatarStyles';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {possibleAvatars} = require('./constNames');

export default function Avatar({ navigation }) {

  // on store le nom de l'avatar choisi, pas l'image car elle peut être directement recuperer
  // dans nos assets

  const handleAvatarPress = async (avatarName) => {
    try {
      await AsyncStorage.setItem('avatar',avatarName);
      navigation.navigate('Profiler');
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <View style={globalStyles.container}>
      <View>
        <Text style={globalStyles.subtitle}>Pick an Avatar</Text>
      </View>

      {Object.keys(possibleAvatars).map((avatarName) => (
        <Pressable key={avatarName} onPress={() => handleAvatarPress(avatarName)}>
          <Image style={avatarStyles.image} source={possibleAvatars[avatarName]} />
        </Pressable>
      ))}

      <Pressable
        style={globalStyles.button}
        onPressIn={() => {
          console.log("move to profiler screen")
        }}>
        <Text style={globalStyles.text}>Next</Text>
      </Pressable>
    </View>
  );
}
