import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from 'react-native';
import loginStyles from '../styles/loginStyles';

export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    return (
        <View style={loginStyles.container}>
          <View>
            <Text style={loginStyles.title}>Locs</Text>
            <Text>Login</Text>
          </View>
          <TextInput 
            style={loginStyles.inputbox}
            placeholder="Username ou email"
            value={email}
            onChangeText={setEmail}
           />
          <TextInput 
            style={loginStyles.inputbox}
            placeholder="Mot de passe"
            value={pwd}
            onChangeText={setPwd}
          />
          <Pressable 
            style={loginStyles.button}
            onPressIn={() => {console.log(email, pwd)}}>
                <Text style={loginStyles.text}>Login</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              console.log("move to register screen");
              navigation.navigate('Register');
            }}>
            <Text style={loginStyles.register}> Register? </Text>
          </Pressable>
        </View>
    );
}
