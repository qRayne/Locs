import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal } from 'react-native';
// import { SelectList } from 'react-native-dropdown-select-list'
import globalStyles from '../styles/globalStyles';
import autourStyles from '../styles/autourStyles';

export default function ChatAutour({navigation}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [km, setKm] = useState("");

    // ajoute un chatBox pour chaque endroit (au lieu de manuellement)
    function chatBox(){

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
                    <View style={globalStyles.row}>
                      <TextInput 
                        style={autourStyles.centerText}
                        inputMode="numeric"
                        value={km}
                        onChangeText={setKm}/>
                      <Text style={autourStyles.centerText}>KM</Text>
                    </View>

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

            {/* replicate this box somehow */}
            <View>
              <Text style={globalStyles.undertext}>
                McDonald's
              </Text>

              <Pressable
                onPressIn={() => {
                  // TODO: somehow send info from this box to chat 
                  navigation.navigate('ChatRoom')
                }}>
                <View style={autourStyles.collapsedBox}>
                  <Text>sejfbhjsd</Text>
                </View>
              </Pressable>
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
