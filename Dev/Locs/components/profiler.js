import { useState } from 'react';
import {Pressable, Text, TextInput, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import globalStyles from '../styles/globalStyles';
import profilerStyles from '../styles/profilerStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { URL } = require('./constNames.js')


export default function Profiler({ navigation }) {
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [pronoms, setPronoms] = useState("");
    const [interests, setInterests] = useState("");
    //const [ddn, setDdn] = useState("");
    const [lien, setLien] = useState("");
    const [occupation, setOccupation] = useState("");
    const [image, setImage] = useState(null);
    const [base64Image,setBase64Image] = useState(null);

    //const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // const showDatePicker = () => {
    //     setDatePickerVisibility(true);
    // };

    // const hideDatePicker = () => {
    //     setDatePickerVisibility(false);
    // };

    // const handleConfirm = (date) => {
    //     console.warn("A date has been picked: ", date);
    //     hideDatePicker();
    // };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5, // permet de compresser l'image pour eviter des temps de chargements trop long
            base64: true 
        });

        if (!result.canceled) {
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
            setImage(result.assets[0].uri);
            setBase64Image(base64);
        };
    }

    async function registerProfil() {
        const user_id = await AsyncStorage.getItem('user_id');
        const choosenAvatar = await AsyncStorage.getItem('avatar');
        try {
            const response = await fetch(`${URL}/create-Profile-User/` + encodeURIComponent(user_id), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    firstName: prenom,
                    lastName: nom,
                    avatar: choosenAvatar,
                    interests: interests,
                    pronouns: pronoms,
                    age: age,
                    facialPhoto: base64Image,
                    socialMediaLinks: lien,
                    occupation: occupation
                })
            });
            const responseData = await response.json();
            if (response.ok) {
                console.log(responseData);
                console.log("move to Login");
                navigation.navigate('Login');
            } else {
                console.log(responseData.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={globalStyles.container}>
            <View>
                <Text style={globalStyles.subtitle}>Create your profile</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Pressable
                    style={globalStyles.circle}
                    onPressIn={pickImage}
                >
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={{ width: '100%', height: '100%', borderRadius: 50 }}
                        />
                    ) : (
                        <Text style={{ fontSize: 30, color: '#000', textAlign: 'center', lineHeight: 80 }}>+</Text>
                    )}
                </Pressable>
            </View>
            <TextInput
                style={globalStyles.inputbox}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={globalStyles.inputbox}
                placeholder="Prenom"
                value={prenom}
                onChangeText={setPrenom}
            />
            <TextInput
                style={globalStyles.inputbox}
                placeholder="Nom"
                value={nom}
                onChangeText={setNom}
            />
            <TextInput
                style={globalStyles.inputbox}
                placeholder="Pronoms"
                value={pronoms}
                onChangeText={setPronoms}
            />
            <TextInput
                style={globalStyles.inputbox}
                placeholder="Interests"
                value={interests}
                onChangeText={setInterests}
            />
            <TextInput
                style={globalStyles.inputbox}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
            />
            <TextInput
                style={globalStyles.inputbox}
                placeholder="Liens"
                value={lien}
                onChangeText={setLien}
            />
            <TextInput
                style={globalStyles.inputbox}
                placeholder="Occupation"
                value={occupation}
                onChangeText={setOccupation}
            />
            <Pressable
                style={globalStyles.button}
                onPressIn={() => {
                    registerProfil();
                }}>
                <Text style={globalStyles.text}> Finish </Text>
            </Pressable>
        </View>
    );
}
