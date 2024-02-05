import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import { firebase } from '../config';

const Signup = ({ navigation }) => {

  // const navigation = useNavigation();
  // const handleLogin = () => {
  //   navigation.navigate('Login');
  // }
  // const handleSignupButton = () => {
  //   navigation.navigate('Home');
  // }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState();

  const registerUser = async () => {
    try 
    {
      // create user in firebase
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      // send email verification
      await firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://authenticationsystem-9e2c9.firebaseapp.com/',
      });

      // store user data in firestore
      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
        firstName,
        lastName,
        phoneNumber,
        email,
      });

      alert('Verification email sent. Please check your email and verify your account.');
      navigation.navigate('Login');
    }
    catch (error) 
    {
      alert(error.message);
    }
  }
  

  return (
    <LinearGradient
      className="flex-1 bg-white"
      colors={['#007260', '#39B68D']} 
    >
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
          >
            <ArrowLeftIcon size="20" color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-2">
          <Text className="text-4xl text-white font-extrabold mt-4">Create An Account</Text>
        </View>
      </SafeAreaView>
      <ScrollView style={{ flex: 1 }}>
        <View className="rounded-tl-2xl rounded-tr-2xl flex-1 bg-white px-8 pt-8 mt-6">
          <View className="form space-y-2">
            <Text className="text-black ml-1 text-lg">Enter First Name:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='First Name'
                onChangeText={(text) => setFirstName(text)}
                autoCapitalize='none'
                autoCorrect={false}
              />
            <Text className="text-black ml-1 text-lg">Enter Last Name:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='Last Name'
                onChangeText={(text) => setLastName(text)}
                autoCapitalize='none'
                autoCorrect={false}
              />           
            <Text className="text-black ml-1 text-lg">Enter Phone Number:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='Phone Number'
                keyboardType='numeric'
                onChangeText={(number) => setPhoneNumber(number)}
              />
            <Text className="text-black ml-1 text-lg">Enter Email Address:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='Email Address'
                onChangeText={(text) => setEmail(text)}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
              />
            <Text className="text-black ml-1 text-lg">Enter Password:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                secureTextEntry
                placeholder='Password'
                onChangeText={(text) => setPassword(text)}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <TouchableOpacity className="flex items-end">
                <Text className="text-black mb-2">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="py-3 bg-black rounded-lg"
                onPress={registerUser}
              >
                <Text className="text-lg text-white text-center font-extrabold">
                  Signup
                </Text>
              </TouchableOpacity>
              <View style={styles.separator}>
                <View style={styles.line}></View>
                <Text style={styles.orText}>Or</Text>
                <View style={styles.line}></View>
              </View>
              <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl flex items-center">
                <View className="flex-row justify-center items-center space-x-3">
                  <Image source={require('../assets/images/google.png')} className="w-10 h-10" />
                  <Text className="text-black text-lg ml-2">Sign In With Google</Text>
                </View>
              </TouchableOpacity>
              <View className="flex-row justify-center mt-7">
                <Text className="text-gray-500 font-semibold">
                    Already have an account?
                </Text>
                <TouchableOpacity onPress={handleLogin}>
                    <Text className="font-semibold text-green mb-8"> Login</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

export default Signup

const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'lightgray',
    marginHorizontal: 4,
  },
  orText: {
    color: 'black',
    fontSize: 16,
  },
});
