import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { calculateDistanceBetweenLocations, calculateBoundsBetweenLocations } from './distanceCalculation';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useRef, useEffect } from 'react';
import { createChatRoom } from './newChatroom';
import * as Loc from 'expo-location';

import locationStyles from '../styles/locationStyles';
import globalStyles from '../styles/globalStyles';
import ChatAutour from './chatAutour';

const { KEY } = require('./constNames.js')
const darkMapStyle = require('../styles/darkMapStyles.json')
const lightMapStyle = require('../styles/lightMapStyles.json')


export default function Location({ navigation }) {
  const [location, setLocation] = useState("");
  const [userlng, setUserLng] = useState('');
  const [userlat, setUserLat] = useState('');
  const [adress, setAdress] = useState('');
  const [lng, setLng] = useState(-73.5664);
  const [lat, setLat] = useState(45.5147);
  const [icon, setIcon] = useState('');
  const [type, setType] = useState('');
  const [desc, setDesc] = useState("");
  const [placeId, setPlaceId] = useState("");

  const ref = useRef();

  useEffect(() => {
    (async () => {
      let { status } = await Loc.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      } else {
        console.log('Access granted!!')
      }
    })();
    getLocationOfUser();
  }, []);

  async function getLocationOfUser() {
    let location = await Loc.getCurrentPositionAsync({ accuracy: Loc.Accuracy.Highest, maximumAge: 10000 });
    setUserLat(location.coords.latitude);
    setUserLng(location.coords.longitude);
  }


  function createChatRoomOnClick(chatRoom) {
    createChatRoom(chatRoom)
      .then(() => {
        navigation.navigate('ChatRoom', {
          chatRoomName: chatRoom.location,
          chatRoomType: chatRoom.type[0],
          chatRoomTypeAdress: chatRoom.adress,
          nearestLocation: userInLocation(),
          previousPage: 'Location'
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function userInLocation() {
    const userLocation = { latitude: userlat, longitude: userlng };
    const placeLocation = { latitude: lat, longitude: lng }
    const distance = calculateDistanceBetweenLocations(userLocation, placeLocation);
    return calculateBoundsBetweenLocations(userLocation, placeLocation, distance);
  }

  return (
    <View style={globalStyles.container}>
      <View>
        <Text style={globalStyles.subtitle}>Location</Text>
      </View>

      {/* Affiche Google Maps avec notre location  */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={locationStyles.map}
        customMapStyle={darkMapStyle}
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        coordinate
        onPoiClick={(e) => {
          setLat(e.nativeEvent.coordinate.latitude)
          setLng(e.nativeEvent.coordinate.longitude)
          setLocation(e.nativeEvent.name)
          setPlaceId(e.nativeEvent.placeId);
        }}>

        {/* Ouvre les Chatrooms éloigné */}
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          title={location.replace(/[\n]/gm, ' ')}
          onPress={() => {
            console.log(type);
            if (type.includes("point_of_interest")) {
              const chatRoom = { placeName: location, adress: adress, coordinate: { latitude: lat, longitude: lng }, isPublic: true }
              createChatRoomOnClick(chatRoom);
            }
            else {
              Alert.alert("This location is off limits");
            }
          }}
        />
      </MapView>

      {/* SEARCH POUR UN ENDROIT */}
      <View style={locationStyles.absolute}>
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder="Search"
          ref={ref}
          onPress={(data, details = null) => {
            setType(details.types);
            setLocation(details.name)
            setAdress(details.vicinity);
            setLng(details.geometry.location.lng)
            setLat(details.geometry.location.lat)
            setIcon(details.icon)
          }}
          query={{
            key: KEY,
            language: "en",
          }}
        />
      </View>
    </View>
  );
}
