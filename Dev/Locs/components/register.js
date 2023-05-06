import { useState } from 'react';
import {Pressable, Text, TextInput, View, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {URL}  = require('./constNames.js')

export default function Register({ navigation }) {
  const [pwd, setPwd] = useState("");
  const [rpwd, setRpwd] = useState("");
  const [email, setEmail] = useState("");
  const [remail, setRemail] = useState("");

  async function register() {
    try {
      const response = await fetch(`${URL}/create-User`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pwd
        })
      });
      const responseData = await response.json();
      if (response.ok) {
        // si le user s'est register alors on garde en memoire son id
        // utile -> car il doit créer un profile qui est un sous schema de user
        // en ayant le user_id -> on créer le profile sur le bon user
        await AsyncStorage.setItem('user_id',responseData);
        console.log("succesfully registered")
        navigation.navigate('Avatar')
      } else {
        console.log(responseData.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <View style={globalStyles.container}>
      <View>
        <Image 
          style={globalStyles.logo}
          source={require('../assets/splash.png')}
          />
      </View>
      <TextInput
        style={globalStyles.inputbox}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={globalStyles.inputbox}
        placeholder="Comfirmez votre email"
        value={remail}
        onChangeText={setRemail}
      />
      <TextInput
        style={globalStyles.inputbox}
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={pwd}
        onChangeText={setPwd}
      />
      <TextInput
        style={globalStyles.inputbox}
        placeholder="Re-entrer mot de passe"
        secureTextEntry={true}
        value={rpwd}
        onChangeText={setRpwd}
      />
      <Pressable
        style={globalStyles.button}
        onPressIn={() =>{
          register();
        }}>
        <Text style={globalStyles.text}>Next</Text>
      </Pressable>
    </View>
  );
}
