import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native'; 

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
  return (
    <View>
      <Text>Elderly Location Tracking: Share Location Code</Text>
      
    </View>
  );
}

const GuardianLocationTracking = () => {
  return (
    <View>
      <Text>Guardian Location Tracking: View Elderly Location</Text>
      
    </View>
  );
}

export default LocationTracking;
