import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { auth } from '../config';
// import * as MailComposer from 'expo-mail-composer';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  const handleLoginButton = async () => {
    try {
      const userCredentials = await auth.signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        // Alert.alert('Incorrect password. Login Failed!!');
      } else {
        console.error('Login failed: ', error);
      }
    }
  };

  return (
    <LinearGradient className="flex-1 bg-white" colors={['#007260', '#39B68D']}>
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
          <Text className="text-4xl text-white font-extrabold mt-4">Welcome Back</Text>
        </View>
      </SafeAreaView>
      <View className="rounded-tl-2xl rounded-tr-2xl flex-1 bg-white px-8 pt-8 mt-20">
        <View className="form space-y-2">
          <Text className="text-black ml-1 text-lg">Enter Your Email:</Text>
          <TextInput
            className="p-4 bg-gray-100 text-black rounded-xl mb-3"
            placeholder='Email'
            autoCapitalize='none'
            keyboardType='email-address'
            onChangeText={(text) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if(emailRegex.test(text) || text === '') 
              {
                setEmail(text);
              }
            }}
          />
          <Text className="text-black ml-1 text-lg">Enter Your Password:</Text>
          <TextInput
            className="p-4 bg-gray-100 text-black rounded-xl mb-3"
            secureTextEntry
            placeholder='Password'
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            className="py-3 bg-black rounded-lg"
            onPress={handleLoginButton}
          >
            <Text className="text-lg text-white text-center font-extrabold">Login</Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-7">
            <Text className="text-gray-500 font-semibold">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text className="font-semibold text-green"> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

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

export default Login;
