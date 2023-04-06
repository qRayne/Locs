import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import locationStyles from '../styles/locationStyles';
import * as Loc from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function Location({ navigation }) {
  const [location, setLocation] = useState(null);

  // on récupère le la permission de l'usager
  // et on utilise un callback pour surveiller s'il y a un changement de position
  useEffect(() => {
    (async () => {
      let { status } = await Loc.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Loc.watchPositionAsync(
        { accuracy: Loc.Accuracy.High },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );

      return () => {
        location.remove();
      };
    })();
  }, []);

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
          latitude: 45.5147,
          longitude: -73.5664,
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
