import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import avatarStyles from '../styles/avatarStyles';
import { ScrollView } from 'react-native';

export default function Avatar({navigation}) {
    return (
        <View style={globalStyles.container}>
          <View>
            <Text style={globalStyles.subtitle}>Pick an Avatar</Text>
          </View>

          <Pressable>
            <Image style={avatarStyles.image} source={require('../assets/img/avatar/rayane.png')}/>
          </Pressable>
          <Pressable>
            <Image style={avatarStyles.image} source={require('../assets/img/avatar/beer.gif')}/>
          </Pressable>
          <Pressable>
            <Image style={avatarStyles.image} source={require('../assets/img/avatar/mad.png')}/>
          </Pressable>
          <Pressable>
            <Image style={avatarStyles.image} source={require('../assets/img/avatar/mex.png')}/>
          </Pressable>
          <Pressable>
            <Image style={avatarStyles.image} source={require('../assets/img/avatar/thumbsup.png')}/>
          </Pressable>

          <Pressable
            style={globalStyles.button}
            onPressIn={() =>{
                console.log("move to profiler screen")
                navigation.navigate('Profiler')
            }}>
            <Text style={globalStyles.text}>Next</Text>
           </Pressable>
        </View>
    );
}
