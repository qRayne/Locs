import { useState, useRef, useEffect } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import locationStyles from '../styles/locationStyles';
import * as Loc from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const { KEY } = require('./constNames.js')
import { createChatRoom } from './newChatroom';
import { calculateDistanceBetweenLocations } from './distanceCalculation';
import ChatAutour from './chatAutour';


export default function Location({ navigation }) {
  const [autocomplete, setAutocomplete] = useState("");
  const [location, setLocation] = useState(null);
  const [adress, setAdress] = useState('');
  const [lng, setLng] = useState(-73.5664);
  const [lat, setLat] = useState(45.5147);
  const [userlng,setUserLng] = useState('');
  const [userlat,setUserLat] = useState('');
  const [icon, setIcon] = useState('');
  const [type, setType] = useState('');
  const [desc, setDesc] = useState("");
  const [km, setKm] = useState(0);

  // details doit etre mis dans chatAutour
  const [details, setDetails] = useState(null);
  const [poi, setPoi] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // 
  const ref = useRef();

  // useEffect(() => {
  //   ref.current?.getCurrentLocation();
  // }, []);


  // async function getCurrentLocation() {
  //   const { status } = await Loc.requestForegroundPermissionsAsync();
  //   if (status !== 'granted') {
  //     console.log('Permission to access location was denied');
  //     return;
  //   }

  //   const location = await Loc.getCurrentPositionAsync({});
  //   // console.log(location.coords.latitude, location.coords.longitude);
  // }

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

  async function createChatRoomOnClick(chatRoom) {
    await createChatRoom(chatRoom)
  }

  function userInLocation(){
    const userLocation = {lat:userlat,lng:userlng};
    const placeLocation = {lat:lat,lng:lng}
    const distance = calculateDistanceBetweenLocations(userLocation,placeLocation);
    return distance <= 0.10; // soit moins de 10m
  }

  return (
    <View style={globalStyles.container}>
      <View>
        <Text style={globalStyles.subtitle}>Location</Text>
      </View>

      <View style={globalStyles.centeredProp}>
        <Pressable
          style={globalStyles.inputbox}
          onPressIn={() => setModalVisible(true)}>
          <Text style={globalStyles.text}>{autocomplete}</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>

        {/* SEARCH POUR UN ENDROIT */}
        <View style={locationStyles.centeredView}>
          <View style={{ width: 300, height: 150 }}>
            <GooglePlacesAutocomplete
              fetchDetails={true}
              placeholder="Search"
              ref={ref}

              onPress={(data, details = null) => {
                // console.log(data, details)
                setDetails(details)
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
            {/* </View> */}
          </View>
        </View>
      </Modal>

      {/* VIEW DE GOOGLE MAPS */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={locationStyles.map}
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        onPoiClick={(e) => {
          // console.log(e)
          console.log(e.nativeEvent.name)
          setPoi(JSON.stringify(e.nativeEvent.placeId))
          setAutocomplete(JSON.stringify(e.nativeEvent.name))
          console.log("poi: " + poi)
        }}>

        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          title={location} //fix later 
          description={"location.toString"} //fix later
          onPress={() => {
            console.log(location);
            if (type.includes("point_of_interest")) {
              const chatRoom = { placeName: location, adress: adress, coordinate: { latitude: lat, longitude: lng }, isPublic: true }
              createChatRoomOnClick(chatRoom);
              navigation.navigate('ChatRoom', { chatRoomName: location,chatRoomType:type[0], chatRoomTypeAdress:adress,nearestLocation : userInLocation()});
            }
            else {
              Alert.alert("This location is off limits");
            }
          }}
        />
      </MapView>

      <Text>{location}</Text>
      <Text>{lat}, {lng}</Text>


      <Pressable
        onPressIn={() => {
          console.log("move to chatAutour screen");
          navigation.navigate('Home', {screen: "ChatAutour"} )
        }}>
        <Text style={globalStyles.register}> Leave? </Text>
      </Pressable>
    </View>
  );
}
