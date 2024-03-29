import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, Text, View, Modal, Image, Alert, Linking, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Buffer } from 'buffer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import globalStyles from '../styles/globalStyles';
import profileStyles from '../styles/profileStyles';

const { URL } = require('./constNames.js')

export default function Profile({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [pronoms, setPronoms] = useState('');
    const [liens, setLiens] = useState('');
    const [occupation, setOccupation] = useState('');
    const [interets, setInterets] = useState('');

    const [facialPhoto, setFacialPhoto] = useState('');
    const [delocdList, setdelocdList] = useState('');
    const [privateMessageList, setPrivateMessageList] = useState('');

    // on attend que la page charge avant de se get les infos
    useEffect(() => {
        getInfos();
    }, []);

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
                setLiens(jsonProfil.socialMediaLinks[0]);

                setInterets(jsonProfil.interests);
                setOccupation(jsonProfil.occupation);

                setdelocdList(jsonProfil.DeLocdList);
                setPrivateMessageList(jsonPrivateMessages);
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function updateProfil() {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode(token);
            const connectionUsername = decoded.username;
            try {
                const response = await fetch(`${URL}/update-profil-info?username=${encodeURIComponent(connectionUsername)}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        pronouns: pronoms,
                        interests: interets,
                        socialMediaLinks: liens,
                        occupation: occupation
                    })
                });
                const responseData = await response.json();
                switch (response.status) {
                    case 200:
                        break;
                    case 404:
                    case 409:
                        Alert.alert(responseData.message);
                        break;
                    default:
                        break;
                }
                getInfos();
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    return (
        <View style={globalStyles.container}>
            <View style={profileStyles.topright}>
                <Pressable
                    onPressIn={() => {
                        navigation.navigate('Deloc', { pm: privateMessageList });
                    }}>
                    <Image style={globalStyles.icon} source={require("../assets/img/logo/Locs.png")} />
                </Pressable>
            </View>

            <View style={profileStyles.topleft}>
                <Pressable
                    onPressIn={() => setEditVisible(true)}>
                    <MaterialCommunityIcons name="pencil-outline" color={"black"} size={50} />
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

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={globalStyles.undertext}>
                        {"@" + username}
                    </Text>
                </View>

                <View style={globalStyles.centeredProp}>
                    <Text style={globalStyles.text3}>{" " + pronoms}</Text>
                </View>

                <View style={profileStyles.box}>
                    <Text style={globalStyles.text2}>
                        <MaterialCommunityIcons name="account-outline" color={"lightgrey"} size={20} />
                        {" " + fullName}
                    </Text>

                    {liens
                        ? <Text style={globalStyles.text2} onPress={() => Linking.openURL("https://"+ liens)}>
                            <MaterialCommunityIcons name="earth" color={"lightgrey"} size={20} />
                            {" " + liens}
                        </Text>
                        : <MaterialCommunityIcons name="earth" color={"lightgrey"} size={20} />

                    }

                    {occupation
                        ? <Text style={globalStyles.text2}>
                            <MaterialCommunityIcons name="briefcase-outline" color={"lightgrey"} size={20} />
                            {" " + occupation}
                        </Text>
                        : <MaterialCommunityIcons name="briefcase-outline" color={"lightgrey"} size={20} />
                    }

                    {interets
                        ? <Text style={globalStyles.text2}>
                            <MaterialCommunityIcons name="palette-outline" color={"lightgrey"} size={20} />
                            {" " + interets}
                        </Text>
                        : <MaterialCommunityIcons name="palette-outline" color={"lightgrey"} size={20} />
                    }
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

            {/* LISTE DE DELOC */}
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
                                <Text key={index}>{username}</Text>))
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

            {/* EDIT INFO */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={editVisible}
                onRequestClose={() => {
                    setEditVisible(!editVisible)
                }}>

                <View style={globalStyles.centeredView}>
                    <View style={globalStyles.modalView}>
                        <TextInput
                            style={globalStyles.inputbox}
                            placeholder="Pronoms"
                            placeholderTextColor={"#95AAE4"}
                            value={pronoms}
                            onChangeText={setPronoms}
                        />
                        <TextInput
                            style={globalStyles.inputbox}
                            placeholder="Interests"
                            placeholderTextColor={"#95AAE4"}
                            value={interets}
                            onChangeText={setInterets}
                        />
                        <TextInput
                            style={globalStyles.inputbox}
                            placeholder="Liens"
                            placeholderTextColor={"#95AAE4"}
                            value={liens}
                            onChangeText={setLiens}
                        />
                        <TextInput
                            style={globalStyles.inputbox}
                            placeholder="Occupation"
                            placeholderTextColor={"#95AAE4"}
                            value={occupation}
                            onChangeText={setOccupation}
                        />
                        <Pressable
                            style={globalStyles.button}
                            onPressIn={() => {
                                setEditVisible(!editVisible);
                                updateProfil();
                            }}>
                            <Text style={globalStyles.text}>ok</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
