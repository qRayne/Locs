import { useState, useEffect } from 'react';
import { Pressable, Text, TextInput, View, Alert, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';

export default function Deloc({ navigation }) {
// pour une liste de message plus detaillée (pas necesairement ceux qui sont deloc), avec leur avatar et le dernier message envoyé
  return (
    <View style={globalStyles.container}>
      <View>
        <Image 
          style={globalStyles.logo}
          source={require('../assets/splash.png')}
          />
      </View>

      <Pressable
        onPressIn={() => {
          console.log("go back");
          navigation.navigate('Home', {screen: "Profile"});
        }}>
        <Text style={globalStyles.register}> Back </Text>
      </Pressable>
    </View>
  );
}
