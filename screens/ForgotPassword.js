// ForgotPassword.js
import React, {useState} from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../config';

const ForgotPassword = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = async () => {
    try {
      // Generate OTP (you may use a library for this)
      const otp = Math.floor(1000 + Math.random() * 9000);

      // Send OTP to the user's phone number using Firebase Authentication
      await auth.signInWithPhoneNumber(`+${phoneNumber}`)
        .then(confirmResult => {
          // Navigate to OTP Verification screen with confirmResult and OTP
          navigation.navigate('OTPVerification', { confirmResult, otp });
        })
        .catch(error => {
          console.error('Error sending OTP:', error);
          Alert.alert('Error', 'Failed to send OTP. Please try again.');
        });
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <>
      <View className="flex justify-center items-center mt-20">
        <Text className="text-xl">Reset Your Password</Text>
      </View>
      <View className="ml-4 mt-8">
        <Text>Enter your phone number:</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType='phone-pad'
          className="p-4 bg-gray-100 text-black rounded-xl mb-3 border-black"
        />
        <TouchableOpacity onPress={handleSendOTP}>
          <Text>Send OTP</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ForgotPassword;
