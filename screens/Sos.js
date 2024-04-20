import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import Plus from '../components/Plus';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import * as SMS from 'expo-sms';
import { firestore } from '../config'; 

export default function Sos() {

  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [displayedPhoneNumber, setDisplayedPhoneNumber] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [displayedName, setDisplayedName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [sos, setSOS] = useState([]); 

  const handleSendSMS = async () => {
    if (!displayedPhoneNumber || !displayedMessage || !displayedName) {
      Alert.alert('Error', 'Please enter all details');
      return;
    }
  
    try {
      const sosCollection = firestore.collection("sos");
  
      const newSOS = {
        name: displayedName,
        phoneNumber: displayedPhoneNumber,
        message: displayedMessage,
      };
  
      await sosCollection.add(newSOS);
  
      const updatedSosSnapshot = await sosCollection.get();
      const updatedSosData = updatedSosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSOS(updatedSosData);
  
      console.log("SOS data added successfully!!");
      
      setModalVisible(false);
  
      await SMS.sendSMSAsync(displayedPhoneNumber, displayedMessage);
      Alert.alert('Success', 'SMS sent successfully');
    } catch (error) {
      console.error("Error adding SOS data: ", error);
      Alert.alert('Error', 'Failed to send SMS');
    }
  };  

  return (
    <>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start mt-8 ml-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl mt-4"
          >
            <ArrowLeftIcon
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.title}>SOS System</Text>
        </View>
      </SafeAreaView>

      <View>
        <Text style={styles.emergencytext}>Having An Emergency?</Text>
        {!(displayedPhoneNumber && displayedMessage && displayedName) && (
          <Text className="text-center mt-10 text-xl font-medium">Click the button to add details</Text>
        )}
      </View>

      <View style={styles.plusContainer}>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Plus
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
      
      {displayedPhoneNumber && displayedMessage && displayedName && (
        <>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={handleSendSMS}
              style={styles.buttonName}
            >
              <Image
                source={require('../assets/images/sos button.png')}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-2xl font-extrabold ml-8" style={{marginTop: 40}}>Details:</Text>
            <View style={styles.contactContainer}>
              <View className="flex-row">
                <Text className="font-bold text-lg">
                  Name:
                </Text>
                <Text className="text-lg"> {displayedName}</Text>
              </View>
              <View className="flex-row">
                <Text className="font-bold text-lg">
                  Phone Number:
                </Text>
                <Text className="text-lg"> {displayedPhoneNumber}</Text>
              </View>
              <View className="flex-row">
                <Text className="font-bold text-lg">
                  Message:
                </Text>
                <Text className="text-lg"> {displayedMessage}</Text>
              </View>
            </View>
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
          <Text className="text-center text-lg mb-4 font-bold">Add Your Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              multiline
              value={name}
              onChangeText={text => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={text => setPhoneNumber(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter message"
              multiline
              value={message}
              onChangeText={text => setMessage(text)}
            />
            <View style={styles.bothButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setDisplayedMessage(message);
                  setDisplayedPhoneNumber(phoneNumber);
                  setDisplayedName(name);
                }}
                style={styles.buttonContainerSubmit}
              >
                <Text className="text-black text-lg font-semibold">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.buttonContainerCancel}
              >
                <Text className="text-white text-lg font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
  },
  detailText: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
    marginTop: 20,
    marginLeft: 80,
  },
  emergencytext: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  helptext: {
    fontSize: 16,
    textAlign: 'center',
  },
  sosButton: {
    marginLeft: 24,
    marginTop: 40,
  },
  plusContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  plusButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 50,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'stretch',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: 100,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: 100,
  },
  contactContainer: {
    padding: 40,
    borderRadius: 80,
    paddingBottom: 18,
    paddingTop: 12,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#ebe0e0',
  },
  button: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold'
  },
  bothButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainerSubmit: {
    backgroundColor: '#39B68D',
    paddingTop: 10,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 15,
  },
  buttonContainerCancel: {
    backgroundColor: 'black',
    paddingTop: 10,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 10,
    borderRadius: 15,
  }
});