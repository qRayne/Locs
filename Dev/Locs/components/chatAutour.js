import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal } from 'react-native';
// import { SelectList } from 'react-native-dropdown-select-list'
import globalStyles from '../styles/globalStyles';
import autourStyles from '../styles/autourStyles';
import Slider from '@react-native-community/slider';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { IP } = require('./constNames.js');


// lorsqu'on va se get l'api pour la localistaion le array va toujours changer
// so on creer les chatroom directement lorsqu'il est autour d'eux
// on se getterai tous les lieux autours de L'usager et on les creerait 
const chatRooms = [
  { name: "McDonalds", type: "FAST FOOD" },
  { name: "Subway", type: "FAST FOOD" },
  { name: "A&W", type: "FAST FOOD" },
  { name: "Poulet Rouge", type: "FAST FOOD" },
  { name: "Cineplex Cartier Latin", type: "CINEMA" },
  { name: "Randolph's", type: "PUB" },
  { name: "Arcade MTL", type: "GAMING PUB" },
  { name: "Chatime", type: "BUBLLE TEA" },
  { name: "Cegep du Vieux-Montreal", type: "EDUCATION" },
  { name: "UQAM", type: "EDUCATION" },
];

export default function ChatAutour({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [km, setKm] = useState(0);

  async function createChatRoom(chatRoom) {
    fetch(`${IP}/create-chatRoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        place: {
          name: chatRoom.name,
          location: {
            latitude: 192.158, // à changer selon la localisation du lieu
            longitude: 192.158 // à changer selon la localisation du lieu
          }
        },
        isPublic: true
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function createChatRooms() {
    for (const chatRoom of chatRooms) {
      await createChatRoom(chatRoom);
    }
  }

  createChatRooms();

  // ajoute un chatBox pour chaque endroit (au lieu de manuellement)
  // a changer ou a reformater 
  // function chatBox(name, chatInfo) {
  //   return (
  //     <View>
  //       <Text style={globalStyles.undertext}>
  //         {name}
  //       </Text>

  //       <Pressable
  //         onPressIn={async () => {
  //           // TODO: somehow send info from this box to chat 
  //           // solution : on envoit le chatroom name vers le prochain component
  //           navigation.navigate('ChatRoom', { chatRoom: name.props.children })
  //           setKm
  //         }}>
  //         <View style={autourStyles.collapsedBox}>
  //           {chatInfo}
  //         </View>
  //       </Pressable>
  //     </View>
  //   )
  // }

  return (
    <View style={autourStyles.container}>
      <View>
        <Text style={globalStyles.subtitle}>Autour de vous</Text>
        <Pressable
          style={autourStyles.profile}
          onPressIn={() => {
            console.log("move to profile screen");
            navigation.navigate('Profile');
          }}
        />

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
                maximumValue={50}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                value={km}
                onSlidingComplete={setKm}
              />
              <Text>{km + " KM"}</Text>
              <Pressable
                style={globalStyles.button}
                onPressIn={() => setModalVisible(!modalVisible)}>
                <Text style={globalStyles.text}>ok</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Bouton qui affiche la DISTANCE */}
        <View style={globalStyles.centeredProp}>
          <Pressable
            style={globalStyles.button}
            onPressIn={() => setModalVisible(true)}>
            <Text style={globalStyles.text}>{km} KM</Text>
          </Pressable>
        </View>

        <ScrollView>
          {chatRooms.map((room, index) => (
            <View key={index}>
              <Text style={globalStyles.undertext}>
                {room.name}
              </Text>

              <Pressable
                onPressIn={() => {
                  navigation.navigate('ChatRoom', { chatRoom: room.name });
                }}>
                <View style={autourStyles.collapsedBox}>
                  <Text>{room.type}</Text>
                </View>
              </Pressable>
            </View>
          ))}
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
