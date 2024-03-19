import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

const Sos = () => {

  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView className="flex">
          <View className="flex-row justify-start mt-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
            >
              <ArrowLeftIcon size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>SOS System</Text>
          </View>
      </SafeAreaView>
      <Text style={styles.emergencytext}>Having An Emergency?</Text>
      <Text style={styles.helptext}>Press the below button to get help</Text>
      <View>
        <Image
          source={require('../assets/images/sos button.png')}
          style={styles.sosButton}
        />
      </View>
    </>
  );
}

export default Sos;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
    marginTop: 20,
    marginLeft: 80,
  },
  emergencytext: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 36,
  },
  helptext: {
    fontSize: 16,
    textAlign: 'center'
  },
  sosButton: {
    marginLeft: 24,
    marginTop: 40,
  }
})