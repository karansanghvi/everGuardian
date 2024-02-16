import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { auth, firebase } from '../config';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
        console.log('signed out')
      })
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(auth.currentUser.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          console.log('Fetched user data:', userData); // Add this line

          setUserData(userData);
        } else {
          console.log('User data not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data from Firestore:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {userData && <Text>Hello {userData.name}</Text>}
      <Text>Email: {auth.currentUser.email}</Text>
      {userData && <Text>PhoneNumber: {userData.phone}</Text>}

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    color: 'white',
    backgroundColor: '#026efd',
    borderRadius: '50%',
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
