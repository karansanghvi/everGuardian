import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const MedicalRecords = () => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    axios.get('https://disease.sh/v3/covid-19/all')
      .then(response => {
        const diseaseNames = Object.keys(response.data);
        setDiseases(diseaseNames);
      })
      .catch(error => {
        console.error('Error fetching diseases:', error);
      });
  }, []);

  const handleSignupButton = () => {
    // Handle the submission logic here, such as navigating to another screen or further processing
    console.log('Selected disease:', selectedDisease);
  }

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#007260', '#39B68D']} 
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          {/* Back button or any other navigation component */}
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>Medical Records</Text>
        </View>
      </SafeAreaView>
      <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingVertical: 20, marginTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'black', fontSize: 16, marginBottom: 10 }}>Select Disease:</Text>
          <ScrollView style={{ maxHeight: 200 }}>
            {diseases.map((disease, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDisease(disease)}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{disease}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity 
          style={{ backgroundColor: 'black', paddingVertical: 15, borderRadius: 10 }}
          onPress={handleSignupButton}
        >
          <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default MedicalRecords;

const styles = StyleSheet.create({
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: 'black',
  },
});
