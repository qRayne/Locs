import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import locationStyles from '../styles/locationStyles';
import * as Loc from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const { KEY } = require('./constNames.js')

export default function Location({ navigation }) {
  const [location, setLocation] = useState(null);
  const [lng, setLng] = useState(-73.5664);
  const [lat, setLat] = useState(45.5147);
  const [desc, setDesc] = useState("");
  const [region, setRegion] = useState(null);
  const [autocomplete, setAutocomplete] = useState("");
  const [km, setKm] = useState(0);

  // details doit etre mis dans chatAutour
  const [details, setDetails] = useState(null); 
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
    // console.log(location.coords.latitude, location.coords.longitude);
  }

  setTimeout(getCurrentLocation, 3000);

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
        
        {/* SEARCH POUR UN ENDROIT */ }
        <View style={locationStyles.centeredView}>
          <View style={{ width: 300, height: 150 }}>            
              <GooglePlacesAutocomplete 
                fetchDetails={true}
                placeholder="Search"
                onPress={(data, details = null)=>{
                  // console.log(data, details)
                  setDetails(details)
                  // console.log(JSON.stringify(details))
                  // console.log(JSON.stringify(details.adr_address))
                  // console.log(JSON.stringify(details.geometry.location))
                  setLocation(details.name)
                  setLng(details.geometry.location.lng)
                  setLat(details.geometry.location.lat)
                  // setDesc(details.editorial_summary.overview)
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
        onPoiClick={(e)=>{
          // console.log(e)
          console.log(e.nativeEvent.name)
          setPoi(JSON.stringify(e.nativeEvent.placeId))
          setAutocomplete(JSON.stringify(e.nativeEvent.name))
          console.log("poi: " + poi)
        }}>
        <Marker 
          coordinate={{latitude: lat, longitude: lng}}
          // coordinate={{latitude: 45.5147, longitude: -73.5664}}
          title={"autocomplete.toString"} //fix later 
          description={"location.toString"} //fix later 
        />
      </MapView>
      
      <Text>{location}</Text>
      <Text>{lat}, {lng}</Text>
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
