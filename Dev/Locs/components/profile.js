import { useState, useEffect } from 'react';
import { Pressable, Text, View, Modal, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import jwtDecode from 'jwt-decode';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { URL } = require('./constNames.js')




export default function Profile({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [facialPhoto, setFacialPhoto] = useState('');
    const [delocdList, setdelocdList] = useState('');

    // on attend que la page charge avant de se get les infos
    useEffect(() => {
        async function getInfos() {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                const decoded = jwtDecode(token);
                const username = decoded.username;
                try {
                    // on ce get les principales infos de l'utilisateurs
                    const profildata = await fetch(`${URL}/profil-info/?username=` + encodeURIComponent(username));
                    const jsonProfil = await profildata.json();
                    // on recupère l'image en base64 et on la transforme en image
                    const base64Image = jsonProfil.facialPhoto.data;
                    const bufferImage = Buffer.from(base64Image, 'base64');
                    setFacialPhoto(bufferImage);
                    setUsername(username);
                    setFullName(jsonProfil.firstName + " " + jsonProfil.lastName);
                    setdelocdList(jsonProfil.DeLocdList);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        getInfos();
    }, []);

    return (

        <View style={globalStyles.container}>
            <View>
                {facialPhoto ? (
                    <Image
                        source={{
                            uri: `data:image/jpg;base64,${facialPhoto}`
                        }}
                        style={{ width: 200, height: 200 }}
                    />
                ) : null}
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
