import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextBase, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = ({ route }) => {
  const navigation = useNavigation();
  const { firstName } = route.params || {};

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleMedicalRecordsButton = () => {
    navigation.navigate('MedicalRecords');
  };

  const handleMedicalRemindersButton = () => {
    navigation.navigate('MedicalReminders');
  };

  const handleLocationTrackingButton = () => {
    navigation.navigate('LocationTracking');
  };

  const handleSOSButton = () => {
    navigation.navigate('SOS');
  };


  return (
    <>
      <LinearGradient className="flex-1" colors={['#007260', '#39B68D']} >
        <Image source={require('../assets/images/ellipse_home.png')} style={styles.backgroundImage} />
        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={handleProfile}>
            <Image source={require('../assets/images/profile-user.png')} style={styles.profileImage} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
              <Text style={styles.greeting}>Hello, {firstName}</Text>
              <Text style={styles.welcome}>Welcome Back</Text>
          </View>
        </View>
        <View>
          <Image
            source={require('../assets/images/3d-cartoon-doctor-character-face-mask-removebg-preview.png')}
            style={styles.heroImage}
          />
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.welcomeContainer}>
              <Text className="font-bold text-3xl ml-2 mt-4">EverGuardian</Text>
              <Text className="text-md ml-2 text-white font-medium">Your Trusted Support For Every</Text>
              <Text className="text-md ml-2 text-white font-medium">Journey In Life!</Text>
              <Image
                source={require('../assets/images/9440461-removebg-preview.png')}
                style={styles.welcomeImage}
              />
            </View>
            <View className="ml-1 mt-4 mr-1">
              <Text className="text-black font-semibold text-lg pl-2">Our Services</Text>
            </View>
            <View style={styles.optionsContainer} className="mx-4 mt-6">
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginLeft: 6,
                  marginRight: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f1f1', 
                  padding: 20, 
                  borderRadius: 10, 
                  marginBottom: 3,
                  shadowColor: 'black', 
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  height: 180
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
                  backgroundColor: '#f5f1f1', 
                  padding: 20, 
                  borderRadius: 10, 
                  marginBottom: 3,
                  shadowColor: 'black', 
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  height: 180,
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

          <View style={styles.optionsContainer} className="mx-4 mt-8 mb-4">
            <TouchableOpacity
              style={{
                flex: 1,
                marginLeft: 6,
                marginRight: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f1f1', 
                padding: 20, 
                borderRadius: 10, 
                marginBottom: 3,
                shadowColor: 'black', 
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                height: 180,
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
                backgroundColor: '#f5f1f1', 
                padding: 20, 
                borderRadius: 10, 
                marginBottom: 3,
                shadowColor: 'black', 
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                height: 180,
              }}
              onPress={handleSOSButton}
            >
              <Image
                source={require('../assets/images/sos.png')}
                style={styles.optionsImage}
              />
              <Text style={{ color: 'black', marginTop: 12 }} className="text-center font-bold text-xl">SOS System</Text>
            </TouchableOpacity>
          </View>  
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 8,
    paddingTop: 8,
    marginTop: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  profileInfo: {
    flexDirection: 'row',
    padding: 16,
    position: 'absolute',
    top: 50, 
    left: 0,
    right: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 8,
  },
  greeting: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', 
  },
  welcome: {
    fontSize: 14,
    color: 'white', 
    marginBottom: 4,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroImage: {
    marginTop: 40,
    width: 157,
    height: 147,
    left: 210,
    top: 20,
  },
  homeBannerImage: {
    width: 40,
    height: 40,
    marginTop: 80,
  },
  welcomeContainer: {
    backgroundColor: '#39B68D',
    padding: 12,
    height: 160,
    borderRadius: 16,
    marginRight: 10,
  },
  welcomeImage: {
    width: 140,
    height: 140,
    marginLeft: 200,
    marginTop: -83,
  },
  optionsContainer: {
    flexDirection: 'row'
  },
  optionsImage: {
    height: 80,
    width: 80,
  }
});
