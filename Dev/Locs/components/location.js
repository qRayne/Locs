import { useEffect } from 'react';
import {Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import locationStyles from '../styles/locationStyles';
import * as Loc from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function Location({navigation}) {
  async function getCurrentLocation() {
    const { status } = await Loc.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
  
    const location = await Loc.getCurrentPositionAsync({});
    console.log(location.coords.latitude, location.coords.longitude);
  }

  getCurrentLocation();
  
    return (
        <View style={globalStyles.container}>
          <View>
            <Text style={globalStyles.subtitle}>Location</Text>
          </View>

          <TextInput>

          </TextInput>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={locationStyles.map}
            region={{
              latitude: 42.882004,
              longitude: 74.582748,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}        
            showsUserLocation={true}
            followsUserLocation={true}
          />
          {/* Sprint 2 - A commencer */}

          <Pressable
            onPressIn={() => {
              console.log("move to chatAutour screen");
              navigation.navigate('ChatAutour')
            }}>
            <Text style={globalStyles.register}> Leave? </Text>
          </Pressable>
        </View>
    );
}
