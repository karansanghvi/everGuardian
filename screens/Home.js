import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [chatMessage, setChatMessage] = useState('');

  const navigation = useNavigation();

  const handleSOSPress = () => {
    alert('SOS button pressed!');
  };

  const handleMedicalRecordsButton = () => {
    navigation.navigate('MedicalRecords');
  }

  const handleProfile = () => {
    navigation.navigate('Profile')
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#007260', '#39B68D']}
        style={styles.sectionContainer}
      >
        <TouchableOpacity style={styles.appointmentButton} onPress={handleProfile}>
          <Text style={styles.appointmentButtonText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
      <LinearGradient
        colors={['#007260', '#39B68D']}
        style={styles.sectionContainer}
      >
        <TouchableOpacity style={styles.appointmentButton} onPress={() => alert('Calender button pressed!')}>
          <Text style={styles.appointmentButtonText}>Calender</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={['#007260', '#39B68D']}
        style={styles.sectionContainer}
      >
        <TouchableOpacity style={styles.appointmentButton} onPress={() => alert('Location Tracking button pressed!')}>
          <Text style={styles.appointmentButtonText}>Location Tracking</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={['#007260', '#39B68D']}
        style={styles.sectionContainer}
      >
        <TouchableOpacity style={styles.appointmentButton} onPress={handleMedicalRecordsButton}>
          <Text style={styles.appointmentButtonText}>Medical Records</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={['#007260', '#39B68D']}
        style={styles.sectionContainer}
      >
        <TouchableOpacity style={styles.appointmentButton} onPress={() => alert('Appointment button pressed!')}>
          <Text style={styles.appointmentButtonText}>Appointment</Text>
        </TouchableOpacity>
      </LinearGradient>

      <TextInput
        style={styles.chatInput}
        value={chatMessage}
        onChangeText={setChatMessage}
        placeholder="Chat with Us!!"
        placeholderTextColor="grey"
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  sectionContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    height: '10%',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign:'center',
    color: 'white',
  },
  appointmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  chatInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  sosButton: {
    position: 'absolute',
    bottom: 20, 
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonText: {
    color: 'white',
    fontSize: 20,
  },
  chatIcon: {
    position: 'absolute',
    top: 30, 
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15, 
    backgroundColor: 'white',
    borderWidth: 1, 
    borderColor: 'black', 
  },
  buttonText: {
    fontSize: 20,  // Adjust the font size as needed
    color: 'white',
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',  // Center text vertically
    justifyContent: 'center', 
  }
});
