import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function Register({navigation}) {
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [rpwd, setRpwd] = useState("");
    const [email, setEmail] = useState("");
    const [remail, setRemail] = useState("");

    return (
        <View style={globalStyles.container}>
          <View>
            <Text style={globalStyles.title}>Locs</Text>
          </View>
          <TextInput 
            style={globalStyles.inputbox}
            placeholder="Username"
            value={user}
            onChangeText={setUser}
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
          <Pressable 
            style={globalStyles.button}
            onPressIn={() => {console.log(user, pwd, email)}}>
                <Text style={globalStyles.text}>Register</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              console.log("move to login screen");
              navigation.navigate('Login')
            }}>
            <Text style={globalStyles.register}> Login? </Text>
          </Pressable>
        </View>
    );
}
