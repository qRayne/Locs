import { Text, TextInput, View } from 'react-native';
import loginStyles from '../styles/loginStyles';

export default function Login() {
  return (
    <View style={loginStyles.container}>
      <View>
        <Text style={loginStyles.title}>Locs</Text>
      </View>
      <TextInput 
        style={loginStyles.inputbox}
        placeholder="Username ou email"
       />
      <TextInput style={loginStyles.inputbox}
        placeholder="Mot de passe"
      />
    </View>
  );
}
