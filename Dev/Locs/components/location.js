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

          {/* Sprint 2 - A commencer */}

          <Pressable
            onPressIn={() => {
              console.log("move to chatAutour screen");
              navigation.navigate('ChatAutour')
            }}>
            <Text style={globalStyles.register}> Leave? </Text>
          </Pressable>
        </View>
    );
}
