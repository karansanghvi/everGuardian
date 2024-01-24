import React from 'react';
import { Text, View } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

export default function App() {

  let [fontsLoaded] = useFonts({
    'Poppins': require('./assets/fonts/Poppins/Poppins-Black.ttf') 
  });
  
  if(!fontsLoaded) {
    return <AppLoading/>
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text style={
        {
          fontFamily: 'Poppins-Black', fontSize: 40
        }
      }>
        Hello World
      </Text>
    </View>
  );
}

