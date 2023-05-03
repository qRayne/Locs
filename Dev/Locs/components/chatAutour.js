import { Pressable, Text, View, Modal, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { createChatRoom } from './newChatroom';
import * as Location from 'expo-location';
import { ScrollView } from 'react-native';
import { Font, AppLoading } from 'expo';
import { getWritableChatRoomWithinRadius } from './nearbyLocationAlgorithm'

import globalStyles from '../styles/globalStyles';
import autourStyles from '../styles/autourStyles';

const { KEY } = require('./constNames.js')

export default function ChatAutour({ navigation }) {
  const [nearestLocation, setNearestLocation] = useState("");
  const [modalChangeDistance, setModalChangeDistance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radiusOfSearch, setRadiusOfSearch] = useState(25);
  const userLocation = { latitude: lat, longitude: lng };
  const alreadyCreatedChatrooms = []

  // les fonctions appeler au depart
  // seul la localisation du user peut être recuperer avant la fin du use effect
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      } else {
        console.log('Access granted!!')
      }
    })();
    getLocationOfUser();
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
    console.log("yes");
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + userLocation.latitude + "%2C" + userLocation.longitude + "&radius=" + radiusOfSearch + "&type=point_of_interest&key=" + KEY + ""
    // const det = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + ID + "&key=" + KEY --> retourne des details comme dans location --> pour editorial_summary.overview
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
      console.log(place);
      if (!alreadyCreatedChatrooms.includes(place['vicinity'])) {
        alreadyCreatedChatrooms.push(place['vicinity']);
        return place;
      }
      return null;
    }).filter(place => place !== null);
    setChatRooms(places);
  };

  // on apelle cette fonction chaque fois que l'utilisateur change de radius
  // recalcul de des chatrooms par le user, de sa localisation et de recuperer le chatroom auquel il peut ecrire
  async function calculateUserChatrooms() {
    getLocationOfUser();
    getChatRoomsByUserLocation(userLocation, radiusOfSearch);
    setNearestLocation(getWritableChatRoomWithinRadius(chatRooms, userLocation, radiusOfSearch));
  }

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <ActivityIndicator size={'large'} color={"#FFFFFF"}></ActivityIndicator>
      ) : (
        <View>
          <View style={autourStyles.row}>
            <Text style={globalStyles.subtitle}>Autour de vous</Text>
          </View>

          {/* Boite qui permet de changer la distance */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalChangeDistance}
            onRequestClose={() => {
              setModalChangeDistance(!modalChangeDistance)
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
                  value={radiusOfSearch}
                  onSlidingComplete={setRadiusOfSearch}
                />
                <Text>{radiusOfSearch + " M"}</Text>
                <Pressable
                  style={globalStyles.button}
                  onPressIn={() => {
                    setModalChangeDistance(!modalChangeDistance)
                    calculateUserChatrooms();
                  }} >
                  <Text style={globalStyles.text}>ok</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* Bouton qui change la DISTANCE */}
          <View style={autourStyles.row}>
            <Pressable
              style={globalStyles.button}
              onPressIn={() => setModalChangeDistance(true)}>
              <Text style={globalStyles.text}>{radiusOfSearch} M</Text>
            </Pressable>

            <Pressable
              style={globalStyles.button}
              onPressIn={() => {
                console.log("move to location screen");
                navigation.navigate('Location');
              }}>
              <Text style={globalStyles.text}>Location</Text>
            </Pressable>
          </View>

          {/* Liste de Loc */}
          <View>
            <ScrollView>
              {chatRooms ? (
                chatRooms.map((place, index) => (
                  // TITRE DU LOC
                  <View key={index}>
                    <Text style={globalStyles.undertext}>
                      {place.placeName}
                    </Text>

                    {/* infoBox */}
                    <Pressable
                      onPressIn={() => {
                        createChatRoomOnClick(place);
                      }}>

                      <View style={autourStyles.collapsedBox}>
                        <Text>{place.placeTypes[0]}</Text>
                        {place.placeName == nearestLocation ? <Text>Chattable</Text> :
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
      )}
    </View>
  );
}