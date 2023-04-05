import { useState, useEffect } from 'react';
import { Pressable, Text, TextInput, View,Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import globalStyles from '../styles/globalStyles';
import loginStyles from '../styles/loginStyles';
const { IP } = require('./constNames.js')

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [status, setStatus] = useState("");

  async function login() {
    try {
      const response = await fetch(`${IP}/login-User`, {
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
        navigation.navigate('ChatAutour');
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

  useEffect(() => {
    (async () => {
      let { status } = await  Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setStatus('Permission to access location was denied');
        return;
      } else {
       console.log('Access granted!!')
       setStatus(status)    
      }
    })();
    }, 
  []);

  const watch_location = async () => {  
    if (status === 'granted') {     
      let location = await Location.watchPositionAsync({
        accuracy:Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 80,
        }, 
        false,
        (location_update) => {
          console.log('update location!', location_update.coords)
        }   
      )
    }
  }

  return (
    <View style={globalStyles.container}>
      <View>
        <Text style={loginStyles.title}>Locs</Text>
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
          navigation.navigate('ChatAutour');
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
