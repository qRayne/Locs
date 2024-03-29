import { Pressable, Text, View, Modal,LogBox, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getWritableChatRoomWithinRadius } from './nearbyLocationAlgorithm'
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { createChatRoom } from './newChatroom';
import * as Location from 'expo-location';

import globalStyles from '../styles/globalStyles';
import autourStyles from '../styles/autourStyles';
import profileStyles from '../styles/profileStyles';

const { KEY } = require('./constNames.js')

export default function ChatAutour({ navigation }) {
  const [nearestLocation, setNearestLocation] = useState("");
  const [radiusOfSearch, setRadiusOfSearch] = useState(25);
  const [modalVisible, setModalVisible] = useState(true);
  const [functionCalled, setFunctionCalled] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const userLocation = { latitude: lat, longitude: lng };
  const alreadyCreatedChatrooms = []

  // les fonctions appeler au depart
  // seul la localisation du user peut être recuperer avant la fin du use effect
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert("You need to authorize the geolocalisation to use this app")
      } else {
        getLocationOfUser();
      }
    })();
    // si le bug de location not accepted juste reload l'app c'est un problème avec la librarire
    LogBox.ignoreAllLogs(); // évite le bug de location not accepted
  }, []);

  function createChatRoomOnClick(place) {
    createChatRoom(place) // plus logique d'utiliser le then dans ce cas de figure
      .then(() => {
        navigation.navigate('ChatRoom', {
          chatRoomName: place.placeName,
          chatRoomType: place.placeTypes[0],
          chatRoomTypeAdress: place.vicinity,
          nearestLocation: place.placeName === nearestLocation,
          previousPage: 'ChatAutour'
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getLocationOfUser() {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, maximumAge: 10000 });
    setLat(location.coords.latitude);
    setLng(location.coords.longitude);
  }

  // update the function to take in radiusOfSearch and userLocation as arguments
  async function getChatRoomsByUserLocation(userLocation, radiusOfSearch) {
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + userLocation.latitude + "%2C" + userLocation.longitude + "&radius=" + radiusOfSearch + "&type=point_of_interest&key=" + KEY
    const res = await fetch(url);
    const data = await res.json();
    const places = data.results.map(googlePlace => {
      const myLat = googlePlace.geometry.location.lat;
      const myLong = googlePlace.geometry.location.lng;
      const coordinate = {
        latitude: myLat,
        longitude: myLong,
      };
      const place = {
        placeTypes: googlePlace.types,
        coordinate,
        placeName: googlePlace.name,
        vicinity: googlePlace.vicinity,
      };
      if (!alreadyCreatedChatrooms.includes(place['vicinity'])) {
        alreadyCreatedChatrooms.push(place['vicinity']);
        return place;
      }
      return null;
    }).filter(place => place !== null);
    return places;
  };

  // on apelle cette fonction chaque fois que l'utilisateur change de radius
  // recalcul de des chatrooms par le user, de sa localisation et de recuperer le chatroom auquel il peut ecrire
  async function calculateUserChatrooms() {
    getLocationOfUser();
    const places = await getChatRoomsByUserLocation(userLocation, radiusOfSearch);
    setChatRooms(places);
    setFunctionCalled(true);
  }
  
  function getNearestLocation() {
    if (chatRooms.length !== 0) {
      const newNearestLocation = getWritableChatRoomWithinRadius(chatRooms, userLocation, radiusOfSearch);
      setNearestLocation(newNearestLocation);
  
      if (newNearestLocation !== "") {
        setChatRooms(filterChatrooms());
        setLoading(false);
        setFunctionCalled(false);
      }
    }
  }
  
  useEffect(() => {
    if (functionCalled) {
      getNearestLocation();
    }
  }, [functionCalled]);
  

  // function permettant de filter la liste de chatrooms pour toujours afficher le chatroom le plus proche
  // aucun paramètre car on accède déjà aux chatrooms et à la localisation 
  function filterChatrooms() {
    // on fait une copie temporaire de chatrooms
    const chatRoomsCopy = [...chatRooms];


    // on trouve l'index
    const nearestIndex = chatRoomsCopy.findIndex(place => place.placeName === nearestLocation);

    // on verifie que l'index est valide et on place le nearest location au debut
    if (nearestIndex !== -1) {
      const nearestPlace = chatRoomsCopy.splice(nearestIndex, 1)[0];

      chatRoomsCopy.unshift(nearestPlace);
    }

    // on update notre liste de chatrooms qui sont filtrées
    return chatRoomsCopy;
  }


  return (
    <View style={globalStyles.container}>
      {/* <View> */}
      <Text style={globalStyles.subtitle}>Autour de vous</Text>

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
            <Text style={globalStyles.font}>Search Radius</Text>
            <Slider
              style={{ width: 200, height: 40, backgroundColor: "#FFF" }}
              step={1}
              minimumValue={25}
              maximumValue={100}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#000"
              thumbTintColor='#000'
              value={radiusOfSearch}
              onSlidingComplete={setRadiusOfSearch}
            />
            <Text style={globalStyles.font}>{radiusOfSearch + " M"}</Text>
            <Pressable
              style={globalStyles.button}
              onPressIn={() => {
                setModalVisible(!modalVisible)
                setLoading(true);
                calculateUserChatrooms();
              }} >
              <Text style={globalStyles.text}>ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Bouton qui change la DISTANCE */}
      <View style={{ paddingBottom: 15 }}>
        <Pressable
          style={globalStyles.button}
          onPressIn={() => setModalVisible(true)}>
          <Text style={globalStyles.text}>{radiusOfSearch} M</Text>
        </Pressable>
      </View>

      {/* Liste de Loc */}
      <ScrollView>
        {chatRooms.length > 0 && !loading
          ? (chatRooms.map((place, index) => (
            // TITRE DU LOC
            <View key={index}>
              <Text style={globalStyles.undertext}>
                {place.placeName}
              </Text>

              {/* infoBox */}
              <TouchableOpacity
                onPress={() => { createChatRoomOnClick(place); }
                }>
                <View style={autourStyles.collapsedBox}>
                  <Text style={autourStyles.subtitle}> {place.placeTypes[0].replace(/_/gm, " ")} </Text>
                  {place.placeName == nearestLocation
                    ? <Text style={globalStyles.font}> Chattable </Text>
                    : <Text style={globalStyles.font}> Seulement lisible </Text>}
                </View>
              </TouchableOpacity>
            </View>
          ))
            // Le loading screen doit être centered
          )
          : <ActivityIndicator style={autourStyles.loading} size={'large'} color={"#FFFFFF"}></ActivityIndicator>}
      </ScrollView>
      {/* </View> */}

      <Pressable
        style={profileStyles.topright}
        onPressIn={() => {
          navigation.navigate('Login');
        }}>
        {/* <Text style={globalStyles.register}> Logout? </Text> */}
        <MaterialCommunityIcons name="logout-variant" size={35} color="black" />
      </Pressable>

    </View>
  );
}