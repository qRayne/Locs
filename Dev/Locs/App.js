import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFonts, Galdeano_400Regular } from '@expo-google-fonts/galdeano';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import ChatAutour from './components/chatAutour';
import Register from './components/register';
import Location from './components/location';
import Chatroom from './components/chatRoom';
import Profiler from './components/profiler';
import Profile from './components/profile';
import Deloc from './components/deloc';
import Avatar from './components/avatar';
import Login from './components/login';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Galdeano_400Regular,
  })

  if (!fontsLoaded) {
    return null;
  }

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
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChatRoom"
          component={Chatroom}
        />
        <Stack.Screen
          name="Profiler"
          component={Profiler}
        />
        <Stack.Screen
          name="Deloc"
          component={Deloc}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )

  function Home(){
    return(
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false
        }}>
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: () => (
                <MaterialCommunityIcons name="face-man-profile" color={"black"} size={25} />
              ),
            }}
          />
          <Tab.Screen
            name="ChatAutour"
            component={ChatAutour}
            options={{
              tabBarLabel: 'Locs',
              tabBarIcon: () => (
                <MaterialCommunityIcons name="home" color={"black"} size={25} />
              ),
            }}
          />
          <Tab.Screen
            name="Location"
            component={Location}
            options={{
              tabBarLabel: 'Location',
              tabBarIcon: () => (
                <MaterialCommunityIcons name="google-maps" color={"black"} size={25} />
              ),
            }}
          />
          
        </Tab.Navigator>
    )
  }

  
}