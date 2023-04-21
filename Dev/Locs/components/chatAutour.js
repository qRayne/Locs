import { useState, useCallback, useEffect } from 'react';
import { Pressable, Text, View, Modal, RefreshControl } from 'react-native';
import globalStyles from '../styles/globalStyles';
import autourStyles from '../styles/autourStyles';
import Slider from '@react-native-community/slider';
import { ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { createChatRoom } from './newChatroom';
import { calculateDistanceBetweenLocations } from './distanceCalculation';
const { KEY } = require('./constNames.js')

// lorsqu'on va se get l'api pour la localistaion le array va toujours changer
// so on creer les chatroom directement lorsqu'il est autour d'eux
// on se getterai tous les lieux autours de L'usager et on les creerait 
// const chatRooms = [
//   { name: "McDonalds", type: "FAST FOOD", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "Subway", type: "FAST FOOD", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "A&W", type: "FAST FOOD", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "Poulet Rouge", type: "FAST FOOD", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "Cineplex Cartier Latin", type: "CINEMA", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "Randolph's", type: "PUB", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "Arcade MTL", type: "GAMING PUB", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "Chatime", type: "BUBLLE TEA", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "Cegep du Vieux-Montreal", type: "EDUCATION", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
//   { name: "UQAM", type: "EDUCATION", location: { latitude: 192.123, longitude: 123 }, isPublic: true },
// ];
// info chatRooms -> location.js -> ( < GooglePlacesAutocomplete /> )
// name:        details.name, -> const autocomplete
// type:        details.references[1], 
// description: details.editorial_summary.overview
// location:    details.geometry.location.lat, details.geometry.location.lng -> const lat, lng

export default function ChatAutour({ navigation }) {
  const [status, setStatus] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [m, setM] = useState(25);
  const [refreshing, setRefreshing] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const alreadyCreatedChatrooms = []
  const [nearestLocation, setNearestLocation] = useState("");


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  setTimeout(() => {
    getChatRoomsByUserLocation();
    getLocationOfUser();
    getWritableChatRoom();
  }, 2000);

  async function getLocationOfUser() {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, maximumAge: 10000 });
    setLat(location.coords.latitude);
    setLng(location.coords.longitude);
  }
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setStatus('Permission to access location was denied');
        return;
      } else {
        console.log('Access granted!!')
        setStatus(status)
      }
    })();
    getChatRoomsByUserLocation();
    getLocationOfUser();
    getWritableChatRoom();
  }, []);


  async function getChatRoomsByUserLocation() {
    // changer le latitude/longitude 
    let places = []
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "%2C" + lng + "&radius=" + m + "&type=point_of_interest&key=" + KEY + ""
    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(res => {
        for (let googlePlace of res.results) {
          let place = {};
          let myLat = googlePlace.geometry.location.lat;
          let myLong = googlePlace.geometry.location.lng;
          let coordinate = {
            latitude: myLat,
            longitude: myLong,
          };
          place['placeTypes'] = googlePlace.types;
          place['coordinate'] = coordinate;
          place['placeName'] = googlePlace.name;
          place['vicinity'] = googlePlace.vicinity;
          if (!alreadyCreatedChatrooms.includes(place['vicinity'])) {
            createChatRoom(place);
            alreadyCreatedChatrooms.push(place['vicinity']);
            places.push(place);
          }
        }
        setChatRooms(places); // récupère tous les places autour d'un certain radius
      })
      .catch(error => {
        console.log(error);
      });
  };

  // le nom changera mais veut dire que le chatroom ayant une distance plus petite que le rayon de reherche
  function getWritableChatRoom() {
    const allDistances = []
    if (chatRooms.length != 0) {
      const userLocation = { lat: lat, lng: lng };
      for (let i = 0; i < chatRooms.length; i++) {
        const placeLocation = {
          lat: chatRooms[i].coordinate.latitude, lng:
            chatRooms[i].coordinate.longitude
        }
        allDistances.push(calculateDistanceBetweenLocations(userLocation, placeLocation))
      }
      minDistance = Math.min(...allDistances);
      nearestDistanceIndex = allDistances.indexOf(minDistance);
      if (chatRooms[nearestDistanceIndex] && minDistance <= m) {
        setNearestLocation(chatRooms[nearestDistanceIndex].placeName)
      };
    }
    else{
      console.log('google api na pas encore calculer tous les lieux');
    }
  }



  return (
    <View style={autourStyles.container}>
      <View>
        <View style={autourStyles.row}>
          <Text style={globalStyles.subtitle}>Autour de vous</Text>

          {/* ce bouton doit avoir l'image de profile */}
          <Pressable
            style={autourStyles.profile}
            onPressIn={() => {
              console.log("move to profile screen");
              navigation.navigate('Profile');
            }}
          />
        </View>

        {/* Boite qui permet de changer la distance */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}>

          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <Text>How far?</Text>
              <Slider
                style={{ width: 200, height: 40 }}
                step={1}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                value={m}
                onSlidingComplete={setM}
              />
              <Text>{m + " M"}</Text>
              <Pressable
                style={globalStyles.button}
                onPressIn={() => setModalVisible(!modalVisible)}>
                <Text style={globalStyles.text}>ok</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Bouton qui change la DISTANCE */}
        <View style={globalStyles.centeredProp}>
          <Pressable
            style={globalStyles.button}
            onPressIn={() => setModalVisible(true)}>
            <Text style={globalStyles.text}>{m} M</Text>
          </Pressable>
        </View>

        <Pressable
          style={globalStyles.button}
          onPressIn={() => {
            console.log("move to location screen");
            navigation.navigate('Location');
          }}>
          <Text style={globalStyles.text}>Location</Text>
        </Pressable>

        <ScrollView
        >
          {chatRooms ? (
            chatRooms.map((room, index) => (
              <View key={index}>
                <Text style={globalStyles.undertext}>
                  {room.placeName}
                </Text>

                <Pressable
                  onPressIn={() => {
                    navigation.navigate('ChatRoom', { 
                      chatRoomName: room.placeName, 
                      chatRoomType: room.placeTypes[0], 
                      chatRoomTypeAdress: room.vicinity,
                      nearestLocation: room.placeName === nearestLocation // true ou false
                    });
                  }}>
                  <View style={autourStyles.collapsedBox}>
                    <Text>{room.placeTypes[0]}</Text>
                    {room.placeName == nearestLocation ? <Text>Vous pouvez ecrire et lire dans ce chatRoom</Text> : 
                  <Text>Vous pouvez seulement lire dans ce chatRoom</Text>}
                  </View>
                </Pressable>
              </View>
            ))
          ) : null}
        </ScrollView>
      </View>

      <Pressable
        onPressIn={() => {
          console.log("move to register screen");
          navigation.navigate('Login');
        }}>
        <Text style={globalStyles.register}> Logout? </Text>
      </Pressable>
    </View>
  );
}
