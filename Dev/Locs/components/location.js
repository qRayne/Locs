import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';

import globalStyles from '../styles/globalStyles';
import locationStyles from '../styles/locationStyles';
import * as Loc from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const { KEY } = require('./constNames.js')


export default function Location({ navigation }) {
  const [location, setLocation] = useState(null);
  const [autocomplete, setAutocomplete] = useState("");
  const [km, setKm] = useState(0);

  // details doit etre mis dans chatAutour
  const [details, setDetails] = useState(""); 
  const [poi, setPoi] = useState("");
  const [modalVisible, setModalVisible] = useState(false);


  // on récupère le la permission de l'usager
  // et on utilise un callback pour surveiller s'il y a un changement de position
  async function getCurrentLocation() {
    const { status } = await Loc.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
  
    const location = await Loc.getCurrentPositionAsync({});
    console.log(location.coords.latitude, location.coords.longitude);
  }

  setTimeout(getCurrentLocation,5000);

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
        onRequestClose={()=>{
          setModalVisible(!modalVisible)
        }}>
        
        <View style={locationStyles.centeredView}>
          <View style={{ width: 300, height: 150 }}>
            {/* <View style={globalStyles.modalView}> */}
              <GooglePlacesAutocomplete
                placeholder="Search"
                onPress={(data, details = null)=>{
                  console.log(data, details)
                  setDetails(details)
                }}
                query={{
                  key: KEY,
                  language: "en",
                }}
                GooglePlacesDetailsQuery={{
                  fields: "website"
                }}
              />
            {/* </View> */}
          </View>
        </View>
      </Modal>

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
          setAutocomplete(JSON.stringify(e.nativeEvent.name))
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
