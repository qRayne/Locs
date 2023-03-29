import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Modal, LogBox,Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import jwtDecode from 'jwt-decode';
import { Buffer } from 'buffer';
import profileStyles from '../styles/profileStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { IP } = require('./constNames.js')


export default function Profile({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [facialPhoto, setFacialPhoto] = useState('');

    async function getInfos() {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode(token);
            const username = decoded.username;
            try {
                // tu peux te get tous les infos du profil
                const profildata = await fetch(`${IP}/profil-info/?username=` + encodeURIComponent(username));
                const jsonProfil = await profildata.json();
                setUsername(username);
                setFullName(jsonProfil.firstName + " " + jsonProfil.lastName);
            } catch (error) {
                console.error(error);
            }
        }
    }

    getInfos();
    return (

        <View style={globalStyles.container}>
            <View>
                <Text style={globalStyles.subtitle}>{fullName}</Text>
                <Text style={globalStyles.undertext}>{username}</Text>
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
