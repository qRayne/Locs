import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import globalStyles from '../styles/globalStyles';
import profilerStyles from '../styles/profilerStyles';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { IP } = require('./constNames.js')


export default function Profiler({ navigation }) {
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [pronoms, setPronoms] = useState("");
    const [ddn, setDdn] = useState("");
    const [lien, setLien] = useState("");
    const [occupation, setOccupation] = useState("");
    const [image, setImage] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        };
    }

    async function registerProfil() {
        const user_id = await AsyncStorage.getItem('user_id');
        try {
            const response = await fetch(`${IP}/create-Profile-User/` + encodeURIComponent(user_id), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    firstName: prenom,
                    lastName: nom,
                    pronouns: pronoms,
                    age: '10', // a modifier en trouvant l'age à l'aide de la date de naissance,
                    facialPhoto: image,
                    socialMediaLinks: lien,
                    occupation: occupation
                })
            });
            const responseData = await response.json();
            if (response.ok) {
                console.log(responseData);
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
                    title="icon"
                    onPressIn={pickImage}

                />
                {image && <Image source={{ uri: image }} style={{ width: 110, height: 110 }} />}
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
            <Pressable
                style={globalStyles.inputbox}
                title="Date de Naissance"
                onPress={showDatePicker}
            >
                <Text>{ddn}</Text>
            </Pressable>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                onChangeText={setDdn}
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
                    console.log("move to Login");
                    navigation.navigate('Login')
                }}>
                <Text style={globalStyles.text}> Finish </Text>
            </Pressable>
        </View>
    );
}
