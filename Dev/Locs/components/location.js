import { calculateDistanceBetweenLocations, calculateBoundsBetweenLocations } from './distanceCalculation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Alert, Text, View, LogBox } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { createChatRoom } from './newChatroom';
import * as Loc from 'expo-location';

import locationStyles from '../styles/locationStyles';
import globalStyles from '../styles/globalStyles';

const darkMapStyle = require('../styles/darkMapStyles.json')
const lightMapStyle = require('../styles/lightMapStyles.json')
const { KEY } = require('./constNames.js')


export default function Location({ navigation }) {

  LogBox.ignoreLogs(["TypeError: Cannot read property"])
  const [location, setLocation] = useState("");
  const [userlng, setUserLng] = useState('');
  const [userlat, setUserLat] = useState('');
  const [adress, setAdress] = useState('');
  const [lng, setLng] = useState(-73.5664);
  const [lat, setLat] = useState(45.5147);
  const [type, setType] = useState('');
  const [desc, setDesc] = useState("");

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
  };

  async function placeId2details(placeid){
    const url = "https://maps.googleapis.com/maps/api/place/details/json?place_id="+ placeid +"&key=" + KEY
    const res = await fetch(url);
    const data = await res.json();
    setDesc("")
    setType(data.result.types)
    setLocation(data.result.name)
    setAdress(data.result.vicinity);
    setLng(data.result.geometry.location.lng)
    setLat(data.result.geometry.location.lat)
    setDesc(data.result.editorial_summary.overview)
  }

  function createChatRoomOnClick() {
    const chatRoom = {
      placeName: location,
      coordinate: { latitude: lat, longitude: lng }
    };
    
    createChatRoom(chatRoom)
      .then(() => {
        navigation.navigate('ChatRoom', {
          chatRoomName: chatRoom.placeName,
          chatRoomType: type[0],
          chatRoomDesc: desc,
          chatRoomTypeAdress: adress,
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
          placeId2details(e.nativeEvent.placeId)
        }}>

        {/* Ouvre les Chatrooms éloigné */}
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          title={location.replace(/[\n]/gm, ' ')}
          onPress={() => {
            if (type.includes("point_of_interest")) {
              createChatRoomOnClick();
            }
            else {
              Alert.alert("Loc off limits");
            }
          }}
        />
      </MapView>

      {/* SEARCH POUR UN ENDROIT */}
      <View style={globalStyles.absolute}>
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder="Search"
          ref={ref}
          onPress={(data, details = null) => {
            setDesc("");
            setType(details.types);
            setLocation(details.name)
            setAdress(details.vicinity);
            setLng(details.geometry.location.lng)
            setLat(details.geometry.location.lat)
            setDesc(details.editorial_summary.overview)
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
