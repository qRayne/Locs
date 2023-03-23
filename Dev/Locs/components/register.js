import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
const {IP}  = require('./constNames.js')

export default function Register({ navigation }) {
  const [pwd, setPwd] = useState("");
  const [rpwd, setRpwd] = useState("");
  const [email, setEmail] = useState("");
  const [remail, setRemail] = useState("");

  async function register() {
    try {
      const response = await fetch(`${IP}/create-User`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pwd
        })
      });
      const responseData = await response;
      if (response.ok) {
        // navigation.navigate('Login'); // faut bouger à la page register Profil 
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
        <Text style={globalStyles.title}>Locs</Text>
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
        onPressIn={register}>
        <Text style={globalStyles.text}>Register</Text>
      </Pressable>
    </View>
  );
}
