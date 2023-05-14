import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, Text, View, Modal, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Buffer } from 'buffer';

import globalStyles from '../styles/globalStyles';
import profileStyles from '../styles/profileStyles';

const { URL } = require('./constNames.js')

export default function Profile({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
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
                    setUsername(username);
                    setFullName(jsonProfil.firstName + " " + jsonProfil.lastName);
                    setdelocdList(jsonProfil.DeLocdList);
                    setPrivateMessageList(jsonPrivateMessages);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        getInfos();
    }, []);

    function redirectToPrivateRoom(chatroom) {
        // vu que le nom du chatroom est egalement les deux noms d'utilisateurs on doit voir tout ce qu'on a en private messages
        // soi nous meme et les autres
        navigation.navigate('ChatRoom', {
            chatRoomName: chatroom.place.name, chatRoomType: "Private chat between you and " + chatroom.place.name.split("_").filter(n => n !== username),
            chatRoomTypeAdress: "", nearestLocation: true, previousPage: 'Profile'
        });
    }


    return (
        <View style={globalStyles.container}>
            {/* Liste de chatrooms prive  */}
            <Text>Tout ses chatrooms privee (ils sont cliquable) : </Text>
            {privateMessageList && privateMessageList.length > 0 ? (
                <>
                    {privateMessageList.map((chatroom, index) => (
                        <TouchableOpacity key={index} onPress={() => redirectToPrivateRoom(chatroom)}>
                            <Text style={globalStyles.undertext}>
                                {chatroom.place.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </>
            ) : (
                <Text>No private message rooms found</Text>
            )}
            <View style={profileStyles.toprow}>
                {/* <Pressable
                    onPressIn={
                        navigation.navigate()
                    }
                >

                </Pressable> */}
            </View>

            <View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {facialPhoto ? (
                        <Image
                            source={{ uri: `data:image/jpg;base64, ${facialPhoto}` }}
                            // style={{ width: 200, height: 200 }}
                            style={profileStyles.circle}
                        />
                    ) : null}
                </View>
                <Text style={globalStyles.subtitle}>{fullName}</Text>
                <Text style={globalStyles.undertext}>{username}</Text>

                {/* ajoute les infos ici */}

                {/* <Text style={globalStyles.undertext}>{pronoms}</Text>
                <Text style={globalStyles.undertext}>{lien}</Text>
                <Text style={globalStyles.undertext}>{occupation}</Text>
                <Text style={globalStyles.undertext}>{interets}</Text> */}
            </View>

            <View style={profileStyles.toprow}>
                <Pressable
                    style={globalStyles.button}
                    onPressIn={() => setModalVisible(true)}
                >
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
                        {delocdList.length > 0 ? (
                            delocdList.map((username, index) => (
                                <Text key={index}>{username}</Text>
                            ))
                        ) : <Text>The delocdList is empty for now</Text>}
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
