import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import loginStyles from '../styles/loginStyles';

export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

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
            onPressIn={() => {
              console.log(email, pwd);
              navigation.navigate('ChatAutour');
            }}>
            <Text style={globalStyles.text}>Login</Text>
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
