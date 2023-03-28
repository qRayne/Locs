import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal } from 'react-native';
import globalStyles from '../styles/globalStyles';
import profileStyles from '../styles/profileStyles';

export default function Profile({navigation}) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        
        <View style={globalStyles.container}>
            <View>
                <Text style={globalStyles.subtitle}>Full Name</Text>
                <Text style={globalStyles.undertext}>@Username</Text>
            </View>


            <Pressable
                style={globalStyles.button}
                onPressIn={() => setModalVisible(true)}
            >
                <Text style={globalStyles.text}>DeLoc'd List</Text>    
            </Pressable>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible)
                }}>

                <View style={globalStyles.centeredView}>
                    <View style={globalStyles.modalView}>
                      <Text>George</Text>
                      <Text>David</Text>
                      <Text>Antoine</Text>
                      <Text>Thomas</Text>

                        <Pressable
                            style={globalStyles.button}
                            onPressIn={() => setModalVisible(!modalVisible)}>
                                <Text style={globalStyles.text}>ok</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
          


            {/* <Pressable
                onPressIn={() => {
                console.log("move to chatAutour screen");
                navigation.navigate('ChatAutour')
                }}>
                <Text style={globalStyles.register}> Leave? </Text>
            </Pressable> */}
        </View>
    );
}
