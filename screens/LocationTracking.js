import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native'; 
import * as Location from 'expo-location';
import { firebase } from "../config";

const LocationTracking = () => {
  const route = useRoute(); 
  const userType = route.params?.userType; 

  return (
    <View>
      {userType === "elderly" ? (
        <ElderlyLocationTracking /> 
      ) : (
        <GuardianLocationTracking /> 
      )}
    </View>
  );
}

const ElderlyLocationTracking = () => {

  const[location, setLocation] = useState(null);

  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if(status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // save location to firebase
      saveLocationToFirebase(location.coords.latitude, location.coords.longitude);
    } else {
      console.log("location permission denied");
    }
  };

  const saveLocationToFirebase = (latitude, longitude) => {
    firebase.database().ref('elderlyLocation').set({
      latitude,
      longitude,
    });
  }

  return (
    <View>
      <Text>Elderly Location Tracking: Share Location Code</Text>
      {/* Add your code for elderly location tracking here */}
    </View>
  );
}

const GuardianLocationTracking = () => {
  return (
    <View>
      <Text>Guardian Location Tracking: View Elderly Location</Text>
      {/* Add your code for guardian location tracking here */}
    </View>
  );
}

export default LocationTracking;
