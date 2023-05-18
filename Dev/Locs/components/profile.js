import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, Text, View, Modal, Image, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Buffer } from 'buffer';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import globalStyles from '../styles/globalStyles';
import profileStyles from '../styles/profileStyles';

const { URL } = require('./constNames.js')

export default function Profile({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [pronoms, setPronoms] = useState('');
    const [lien, setLien] = useState('');
    const [occupation, setOccupation] = useState('');
    const [interets, setInterets] = useState('');

    const [facialPhoto, setFacialPhoto] = useState('');
    const [delocdList, setdelocdList] = useState('');
    const [privateMessageList, setPrivateMessageList] = useState('');

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
                    const profilPrivateMessages = await fetch(`${URL}/user-private-messages/?username=` + encodeURIComponent(username));
                    const jsonProfil = await profildata.json();
                    const jsonPrivateMessages = await profilPrivateMessages.json();
                    // on recupère l'image en base64 et on la transforme en image
                    const base64Image = jsonProfil.facialPhoto.data;
                    const bufferImage = Buffer.from(base64Image, 'base64');

                    setFacialPhoto(bufferImage);
                    setFullName(jsonProfil.firstName + " " + jsonProfil.lastName);
                    setUsername(username);
                    setPronoms(jsonProfil.pronouns);
                    setLien(jsonProfil.socialMediaLien);

                    setInterets(jsonProfil.interests);
                    setOccupation(jsonProfil.occupation);

                    setdelocdList(jsonProfil.DeLocdList);
                    setPrivateMessageList(jsonPrivateMessages);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        getInfos();
    }, []);

    return (
        <View style={globalStyles.container}>
            <View style={profileStyles.toprow}>
                <Pressable
                    onPressIn={() =>{ navigation.navigate('Deloc', { pm: privateMessageList });
                }}>
                    <Image style={globalStyles.icon} source={require("../assets/img/logo/Locs.png")} />
                </Pressable>
            </View>

            <View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {facialPhoto
                        ? (<Image
                            source={{ uri: `data:image/jpg;base64, ${facialPhoto}` }}
                            // style={{ width: 200, height: 200 }}
                            style={profileStyles.circle}
                        />)
                        : null}
                </View>

                <View style={profileStyles.box}>
                    <Text style={globalStyles.undertext}>{fullName}</Text>
                    <Text style={globalStyles.undertext}>{username}</Text>
                    <Text style={globalStyles.text2}>{pronoms}</Text>
                    <Text style={globalStyles.text2}>{lien}</Text>
                    <Text style={globalStyles.text2}>{occupation}</Text>
                    <Text style={globalStyles.text2}>{interets}</Text>
                </View>
                
            </View>

            <View>
                <Pressable
                    style={globalStyles.button}
                    onPressIn={() => setModalVisible(true)}>
                    <Text style={globalStyles.text}>DeLoc'd List</Text>
                </Pressable>
            </View>

            {/* A Changer pour que sa soit comme dans instagram  */}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible)
                }}>

                <View style={globalStyles.centeredView}>
                    <View style={globalStyles.modalView}>
                        {/* liste de deloc, comme la liste de followers, cliquer dessus ouvre leur profile */}
                        {delocdList.length > 0
                            ? (delocdList.map((username, index) => (
                                <Text key={index}>{username}</Text>
                            ))
                            )
                            : <Text> Go DeLoc some people! </Text>}
                        <Pressable
                            style={globalStyles.button}
                            onPressIn={() => setModalVisible(!modalVisible)}>
                            <Text style={globalStyles.text}>ok</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

        </View>
    );
}
