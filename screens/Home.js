import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = ({route}) => {

  const navigation = useNavigation();
  const { firstName } = route.params || {};

  const handleProfile = () => {
    navigation.navigate('Profile');
  }

  const handleMedicalRecordsButton = () => {
    navigation.navigate('MedicalRecords');
  }

  const handleMedicalRemindersButton = () => {
    navigation.navigate('MedicalReminders');
  }

  const handleLocationTrackingButton = () => {
    navigation.navigate('LocationTracking');
  }

  const handleActivityTrackingButton = () => {
    navigation.navigate('ActivityTracking');
  }

  return (
    <>
      <View style={styles.container}>
        <View className="mt-4">
          <TouchableOpacity onPress={handleProfile}>
            <Image
              source={require('../assets/images/profile-user.png')}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hello {firstName}!</Text>
          <Text style={styles.welcome}>Welcome to everGuardian!</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View className="rounded-xl mx-4 p-12 items-center shadow-lg" style={styles.welcomeContainer}>
          <Text className="text-center font-bold text-xl">Your Trusted Support For Every Journey In Life!!</Text>
        </View>
        <View style={styles.optionsContainer} className="mx-4 mt-8">
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 6,
              marginRight: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white', 
              padding: 20, 
              borderRadius: 10, 
              marginBottom: 3,
              shadowColor: 'black', 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              height: 260
            }}
            onPress={handleMedicalRemindersButton}
          >
            <Image
              source={require('../assets/images/medical_reminders.png')}
              style={styles.optionsImage}
            />
            <Text style={{ color: 'black', marginTop: 12 }} className="text-center font-bold text-xl">Medical Reminders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 6,
              marginRight: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white', 
              padding: 20, 
              borderRadius: 10, 
              marginBottom: 3,
              shadowColor: 'black', 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
            onPress={handleMedicalRecordsButton}
          >
            <Image
              source={require('../assets/images/medical_records.png')}
              style={styles.optionsImage}
            />
            <Text style={{ color: 'black', marginTop: 12 }} className="text-center font-bold text-xl">Medical Records</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer} className="mx-4 mt-8">
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 6,
              marginRight: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white', 
              padding: 20, 
              borderRadius: 10, 
              marginBottom: 3,
              shadowColor: 'black', 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              height: 260
            }}
            onPress={handleLocationTrackingButton}
          >
            <Image
              source={require('../assets/images/location.png')}
              style={styles.optionsImage}
            />
            <Text style={{ color: 'black', marginTop: 12 }} className="text-center font-bold text-xl">Location Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 6,
              marginRight: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white', 
              padding: 20, 
              borderRadius: 10, 
              marginBottom: 3,
              shadowColor: 'black', 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
            onPress={handleActivityTrackingButton}
          >
            <Image
              source={require('../assets/images/tracking-app.png')}
              style={styles.optionsImage}
            />
            <Text style={{ color: 'black', marginTop: 12 }} className="text-center font-bold text-xl">Activity Tracking</Text>
          </TouchableOpacity>
        </View>      
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginTop: 12,
  },
  image: {
    width: 50,
    height: 50,
  },
  textContainer: {
    marginLeft: 8,
  },
  greeting: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 14,
  },
  welcomeContainer: {
    backgroundColor: '#39B68D',
  },
  optionsContainer: {
    flexDirection: 'row'
  },
  optionsImage: {
    height: 80,
    width: 80,
  }
});

export default Home;
