import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { auth, firebase } from '../config';
import { useNavigation } from '@react-navigation/native';

const Home = ({ route }) => {
  // const { email, firstName, lastName, phoneNumber } = route.params || {};
  const phoneNumber = auth.currentUser.phoneNumber;
  const navigation = useNavigation();
  // const [name, setName] = useState('');

  const handleSignOut = () => {
    auth
    .signOut()
    .then(()=> {
      navigation.replace("Login")
    })
    .catch(error => alert(error.message))
  }
  // useEffect(() => {
  //   firebase.firestore().collection('users')
  //     .doc(firebase.auth().currentUser.uid).get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         const userData = snapshot.data();
  //         setName(userData.firstName); 
  //       } else {
  //         console.log('user does not exist');
  //       }
  //     })
  // }, [])

  return (
    <View style = {styles.container}>
      <Text>Email: {auth.currentUser.email}</Text>
      <Text>Name: {auth.currentUser.firstName} </Text>
      <Text>PhoneNumber: {phoneNumber}</Text>


      <TouchableOpacity
      style = {styles.button}
      >
        <Text 
        onPress = {handleSignOut}
        style = {styles.container}>Sign out</Text>
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
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  }
});
