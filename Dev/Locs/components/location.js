import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import locationStyles from '../styles/locationStyles';

export default function Location({navigation}) {
    return (
        <View style={globalStyles.container}>
          <View>
            <Text style={globalStyles.subtitle}>Location</Text>
          </View>

          


          <Pressable
            onPressIn={() => {
              console.log("move to login screen");
              navigation.navigate('Login')
            }}>
            <Text style={globalStyles.register}> Login? </Text>
          </Pressable>
        </View>
    );
}
