import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import globalStyles from '../styles/globalStyles';
import profilerStyles from '../styles/profilerStyles';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Location({navigation}) {
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
            />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
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
            onPressIn={() => {
              console.log("move to ChatAutour screen");
              navigation.navigate('ChatAutour')
            }}>
            <Text style={globalStyles.register}> Login? </Text>
          </Pressable>
        </View>
    );
}
