import { useState, useEffect } from 'react';
import { Pressable, Text, TextInput, View, Alert, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';
import loginStyles from '../styles/loginStyles';
const { URL } = require('./constNames.js')

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  async function login() {
    try {
      const response = await fetch(`${URL}/login-User`, {
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
        // la connection marche et on recupere le token du fetch
        // le token prouve que l'usager s'est connecter à notre application
        await AsyncStorage.setItem('token', responseData.token);
        navigation.navigate("Home", {screen: 'ChatAutour'});
      } else {
        Alert.alert('Authentication failed', 'Please check your credentials and try again.');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // si l'usager revient dans le login alors on attend que la page charge pour lui enlever son token
  // de connexion
  async function removeToken() {
    try {
      await AsyncStorage.removeItem('token');

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    removeToken();
  }, []);

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
        placeholder="Username ou email"
        value={email}
        autoComplete="username"
        onChangeText={setEmail}
      />
      <TextInput
        style={globalStyles.inputbox}
        placeholder="Mot de passe"
        autoComplete="password"
        secureTextEntry={true}
        value={pwd}
        onChangeText={setPwd}
      />
      <Pressable
        style={globalStyles.button}
        onPressIn={login}>
        <Text style={globalStyles.text}>Login</Text>
      </Pressable>

      <Pressable
        style={globalStyles.button}
        onPressIn={() => {
          console.log("move to chatAutour screen");
          navigation.navigate('Home', {screen: "ChatAutour"});
        }}>
        <Text style={globalStyles.text}>ChatAutour</Text>
      </Pressable>

      <Pressable
        onPressIn={() => {
          console.log("move to register screen");
          navigation.navigate('Register');
        }}>
        <Text style={globalStyles.register}> Register? </Text>
      </Pressable>
    </View>
  );
}
