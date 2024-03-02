import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native'

export default function MedicalReminders() {

  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
          >
            <ArrowLeftIcon size="20" color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Medical Reminders</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    marginTop: 10
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
    marginTop: 20,
    marginLeft: 40,
  },
});