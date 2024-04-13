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
        <GuardianLocationTracking guardianLocation={guardianLocation} confirmationCode={confirmationCode} userType={userType} /> 
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

const GuardianLocationTracking = ({ guardianLocation, confirmationCode, userType }) => {
  const [elderlyLocation, setElderlyLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElderlyLocation = async () => {
      try {
        if (userType === "guardian" && confirmationCode) {
          console.log("Fetching location data for elderly with confirmation code:", confirmationCode);
          const elderlyLocationDoc = await firestore
            .collection('location')
            .doc(confirmationCode)
            .get();
    
          if (elderlyLocationDoc.exists) {
            const elderlyLocationData = elderlyLocationDoc.data();
            console.log("Elderly Location Data:", elderlyLocationData);
            setElderlyLocation({
              latitude: elderlyLocationData.latitude,
              longitude: elderlyLocationData.longitude,
            });
          } else {
            console.log("No location data found for elderly with confirmation code:", confirmationCode);
          }
        } else {
          console.log("Not a guardian or confirmation code is null");
        }
      } catch (error) {
        console.error("Error fetching elderly location:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchElderlyLocation();
  }, [confirmationCode, userType]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesText}>
          User Type: {userType}
        </Text>
        <Text style={styles.coordinatesText}>
          Confirmation Code: {confirmationCode}
        </Text>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : elderlyLocation ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: elderlyLocation.latitude,
              longitude: elderlyLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: elderlyLocation.latitude,
                longitude: elderlyLocation.longitude,
              }}
              title="Elderly's Location"
            />
          </MapView>
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              Latitude: {elderlyLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Longitude: {elderlyLocation.longitude.toFixed(6)}
            </Text>
          </View>
        </>
      ) : (
        <Text>No location data available for the elderly.</Text>
      )}
    </View>
  );
};



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
  },
  coordinatesContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  coordinatesText: {
    fontSize: 16,
    color: '#333',
  },
});
