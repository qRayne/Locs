import { useState } from 'react';
import { Pressable, Text, TextInput, View, Image, Alert } from 'react-native';
import globalStyles from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { URL } = require('./constNames.js')

export default function Register({ navigation }) {
  const [pwd, setPwd] = useState("");
  const [rpwd, setRpwd] = useState("");
  const [email, setEmail] = useState("");
  const [remail, setRemail] = useState("");

  async function register() {
    if (email == remail && pwd == rpwd) {
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
        switch (response.status) {
          case 200:
            await AsyncStorage.setItem('user_id', responseData);
            console.log("Successfully registered");
            navigation.navigate('Avatar');
            break;
          case 400:
            Alert.alert(responseData.message);
            break;
          default:
            console.log(responseData.message);
            break;
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    else{
      Alert.alert("the email and the password needs to be the same");
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

      <View style={globalStyles.space}>
        <Text style={globalStyles.font}> Password needs minimum</Text>
        <Text style={globalStyles.font}> 8 characters, </Text>
        <Text style={globalStyles.font}> 1 uppercase and lowercase letter, </Text>
        <Text style={globalStyles.font}> a symbol and a number </Text>
      </View>

      <TextInput
        style={globalStyles.inputbox}
        placeholder="Email"
        placeholderTextColor={"#95AAE4"}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={globalStyles.inputbox}
        placeholder="Comfirmez votre email"
        placeholderTextColor={"#95AAE4"}
        value={remail}
        onChangeText={setRemail}
      />
      <TextInput
        style={globalStyles.inputbox}
        placeholder="Mot de passe"
        placeholderTextColor={"#95AAE4"}
        secureTextEntry={true}
        value={pwd}
        onChangeText={setPwd}
      />
      <TextInput
        style={globalStyles.inputbox}
        placeholder="Re-entrer mot de passe"
        placeholderTextColor={"#95AAE4"}
        secureTextEntry={true}
        value={rpwd}
        onChangeText={setRpwd}
      />
      <Pressable
        style={globalStyles.button}
        onPressIn={() => {
          register();
        }}>
        <Text style={globalStyles.text}>Next</Text>
      </Pressable>
    </View>
  );
}
