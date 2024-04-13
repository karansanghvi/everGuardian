import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native'; 
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import * as Location from 'expo-location';
import { firestore, auth } from '../config'; 

const LocationTracking = () => {
  const route = useRoute(); 
  const navigation = useNavigation();
  const [userType, setUserType] = useState(null); 
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState(null); 
  const [guardianLocation, setGuardianLocation] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserType(userData.userType);
            setConfirmationCode(userData.confirmationCode);
          } else {
            console.log("User data not found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setErrorMessage('Permission to access location was denied');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        updateLocationInFirestore(currentLocation);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMessage('Error getting location');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchGuardianLocation = async () => {
      try {
        if (userType === "guardian" && confirmationCode) {       
          const guardianDoc = await firestore
            .collection('guardians')
            .doc(confirmationCode)
            .get();
  
          if (guardianDoc.exists) {
            const guardianData = guardianDoc.data();
            setGuardianLocation(guardianData.location);

            if (guardianData.confirmationCode === confirmationCode) {
              const { latitude, longitude } = guardianData.location;
              await firestore.collection('location').doc(confirmationCode).update({
                latitude,
                longitude,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching guardian location:", error);
      }
    };
  
    fetchGuardianLocation();
  }, [userType, confirmationCode]);
  

  const updateLocationInFirestore = async (currentLocation) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          confirmationCode: confirmationCode,
          userType: userType 
        };
  
        await firestore.collection('location').doc(currentUser.uid).set(userData);
      }
    } catch (error) {
      console.error("Error updating location in Firestore:", error);
    }
  };  

  return (
    <>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start mt-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
          >
            <ArrowLeftIcon size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Location</Text>
        </View>
      </SafeAreaView>
      {userType === "elderly" ? (
        <ElderlyLocationTracking location={location} errorMessage={errorMessage} confirmationCode={confirmationCode} /> 
      ) : (
        <GuardianLocationTracking guardianLocation={guardianLocation} confirmationCode={confirmationCode} /> 
      )}
    </>
  );
};

const ElderlyLocationTracking = ({ location, errorMessage, confirmationCode }) => {
  return (
    <View style={{ flex: 1 }}>
      {errorMessage ? (
        <Text>{errorMessage}</Text>
      ) : location ? (
          <>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
              />
            </MapView>
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinatesText}>
                Latitude: {location.coords.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinatesText}>
                Longitude: {location.coords.longitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinatesText}>
                Confirmation Code: {confirmationCode}
              </Text>
            </View>
          </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const GuardianLocationTracking = ({ confirmationCode }) => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Guardian Location Tracking</Text>
      <Text>Confirmation Code: {confirmationCode}</Text>
    </View>
  );
}

export default LocationTracking;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
    marginTop: 20,
    marginLeft: 60,
  },
  map: {
    flex: 1,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  }
});
