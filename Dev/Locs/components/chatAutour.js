import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal } from 'react-native';
// import { SelectList } from 'react-native-dropdown-select-list'
import globalStyles from '../styles/globalStyles';
import autourStyles from '../styles/autourStyles';
import Slider from '@react-native-community/slider';
import { ScrollView } from 'react-native';

export default function ChatAutour({navigation}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [km, setKm] = useState(0);

    // ajoute un chatBox pour chaque endroit (au lieu de manuellement)
    function chatBox(name, chatInfo){
      return(
        <View>
          <Text style={globalStyles.undertext}>
            {name}
          </Text>

          <Pressable
            onPressIn={() => {
              // TODO: somehow send info from this box to chat 
              navigation.navigate('ChatRoom')
              setKm
            }}>
            <View style={autourStyles.collapsedBox}>
              {chatInfo}
            </View>
          </Pressable>
        </View>
      )
    }

    return (
        <View style={autourStyles.container}>
          <View>
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
                    <Text>How far?</Text>
                    <Slider 
                      style={{width: 200, height: 40}}
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
            
            <View>
              <ScrollView>
                {chatBox(<Text>McDonalds</Text>, <Text>FAST FOOD</Text> )}
                {chatBox(<Text>Subway</Text>, <Text>FAST FOOD</Text> )}
                {chatBox(<Text>A&W</Text>, <Text>FAST FOOD</Text> )}
                {chatBox(<Text>Poulet Rouge</Text>, <Text>FAST FOOD</Text> )}
                {chatBox(<Text>Cineplex Cartier Latin</Text>, <Text>CINEMA</Text> )}
                {chatBox(<Text>Randolph's</Text>, <Text>PUB</Text> )}
                {chatBox(<Text>Arcade MTL</Text>, <Text>GAMING PUB</Text> )}
                {chatBox(<Text>Chatime</Text>, <Text>BUBLLE TEA</Text> )}
                {chatBox(<Text>Cegep du Vieux-Montreal</Text>, <Text>EDUCATION</Text> )}
                {chatBox(<Text>UQAM</Text>, <Text>EDUCATION</Text> )}
              </ScrollView>

            </View>
            

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
