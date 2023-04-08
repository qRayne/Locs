import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import locationStyles from '../styles/locationStyles';
import * as Loc from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const { KEY } = require('./constNames.js')


export default function Location({ navigation }) {
  const [location, setLocation] = useState(null);
  const [poi, setPoi] = useState("");

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

      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data, details = null)=>{
          console.log(data, details)
        }}
        query={{
          key: KEY,
          language: "en",
        }}
        GooglePlacesDetailsQuery={{
          fields: "website"
        }}
      />
      
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
        onPoiClick={(e)=>{
          console.log(e.nativeEvent.name)
          setPoi(JSON.stringify(e.nativeEvent.placeId))
          console.log("poi: " + poi)
        }}

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
