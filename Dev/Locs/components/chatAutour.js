import * as Location from 'expo-location';
import React, { useState, useCallback, useEffect } from 'react';
import { Pressable, Text, View, Modal, RefreshControl } from 'react-native';
import { calculateDistanceBetweenLocations } from './distanceCalculation';
import { ScrollView } from 'react-native';
import { createChatRoom } from './newChatroom';
import { Font, AppLoading } from 'expo'
import globalStyles from '../styles/globalStyles';
import autourStyles from '../styles/autourStyles';
import Slider from '@react-native-community/slider';

const { KEY } = require('./constNames.js')

export default function ChatAutour({ navigation }) {
  const [nearestLocation, setNearestLocation] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [status, setStatus] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [m, setM] = useState(25);
  const alreadyCreatedChatrooms = []

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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

  async function getLocationOfUser() {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, maximumAge: 10000 });
    setLat(location.coords.latitude);
    setLng(location.coords.longitude);
  }

  async function getChatRoomsByUserLocation() {
    // changer le latitude/longitude 
    let places = []
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "%2C" + lng + "&radius=" + m + "&type=point_of_interest&key=" + KEY + ""
    // const det = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + ID + "&key=" + KEY --> retourne des details comme dans location --> pour editorial_summary.overview
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
      // console.log('google api na pas encore calculer tous les lieux');
    }
  }

  setTimeout(() => {
    getChatRoomsByUserLocation();
    getLocationOfUser();
    getWritableChatRoom();
  }, 2000);

 
  return (
    <View style={globalStyles.container}>
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
                style={{ width: 200, height: 40, backgroundColor: "#FFF" }}
                step={1}
                minimumValue={25}
                maximumValue={500}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#000"
                thumbTintColor='#000'
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
        <View style={autourStyles.row}>
          <Pressable
            style={globalStyles.button}
            onPressIn={() => setModalVisible(true)}
          >
            <Text style={globalStyles.text}>{m} M</Text>
          </Pressable>

          <Pressable
            style={globalStyles.button}
            onPressIn={() => {
              console.log("move to location screen");
              navigation.navigate('Location');
            }
          }>
            <Text style={globalStyles.text}>Location</Text>
          </Pressable>
        </View>
        
        {/* Liste de Loc */}
        <ScrollView>
          {chatRooms ? (
            chatRooms.map((room, index) => (
              // TITRE DU LOC
              <View key={index}>
                <Text style={globalStyles.undertext}>
                  {room.placeName}
                </Text>

                {/* infoBox */}
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
                    {room.placeName == nearestLocation ? <Text>Chattable</Text> : 
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
