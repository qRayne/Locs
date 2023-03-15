import { useFonts } from 'expo-font';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/login';
import Register from './components/register';
import ChatAutour from './components/chatAutour';
import Chatroom from './components/chatRoom';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    'Galdeano-Regular': require('./assets/fonts/Galdeano-Regular.ttf')
  })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title:"Welcome"}}
        />
        <Stack.Screen 
          name="Register" 
          component={Register}
        />
        <Stack.Screen 
          name="ChatAutour" 
          component={ChatAutour}
        />
        <Stack.Screen 
          name="ChatRoom" 
          component={Chatroom}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}