import { StyleSheet, Text, TextInput, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ChatAutour from './components/chatAutour';
import Register from './components/register';
import Location from './components/location';
import Chatroom from './components/chatRoom';
import Profiler from './components/profiler';
import Profile from './components/profile';
import Avatar from './components/avatar';
import Login from './components/login';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Register"
          component={Register}
        />
        <Stack.Screen
          name="Avatar"
          component={Avatar}
        />
        <Stack.Screen
          name="Profiler"
          component={Profiler}
        />
        <Stack.Screen
          name="Location"
          component={Location}
        />
        <Stack.Screen
          name="ChatAutour"
          component={ChatAutour}
        />
        <Stack.Screen
          name="ChatRoom"
          component={Chatroom}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )

  
}