import { StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/login';
import Register from './components/register';

const Stack = createNativeStackNavigator();

export default function App() {
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}