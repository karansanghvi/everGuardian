import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { firebase } from '../config';

const Home = ({ route }) => {
  const { email, firstName, lastName, phoneNumber } = route.params || {};

  const [name, setName] = useState('');

  useEffect(() => {
    firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const userData = snapshot.data();
          setName(userData.firstName); 
        } else {
          console.log('user does not exist');
        }
      })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Hello, {firstName}
      </Text>
      <Text>Email: {email}</Text>
      <Text>Last Name: {lastName}</Text>
      <Text>Phone Number: {phoneNumber}</Text>
      <TouchableOpacity
        onPress={() => { firebase.auth().signOut() }}
        style={styles.button}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  }
});
