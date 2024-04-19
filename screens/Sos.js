import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import Plus from '../components/Plus';
import { firestore } from '../config'; 
import * as SMS from 'expo-sms';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ handleSendHelpSMS, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emergencytext}>Having An Emergency?</Text>
      <Text style={styles.helptext}>Press the below button to get help</Text>
      <Button
        title="SOS"
        onPress={handleSendHelpSMS}
      />
    </View>
  );
};

const ContactsScreen = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsSnapshot = await firestore.collection("contacts").get();
        const contactsData = contactsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      }
    };

    fetchContacts();
  }, []); 

  const handleSubmitForm = async () => {
    if (!name || !phoneNumber) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      const contactsCollection = firestore.collection("contacts");

      const newContact = {
        name: name,
        phoneNumber: phoneNumber,
      };

      await contactsCollection.add(newContact);

      const updatedContactsSnapshot = await contactsCollection.get();
      const updatedContactsData = updatedContactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(updatedContactsData);

      setTimeout(() => {
        console.log("Contact added successfully!!");
        setShowPopup(false);
      }, 1000);

      console.log("Contact created: ", newContact);
      // onContactCreated(newContact);

    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  return (
    <>
    <View style={styles.message}>
      {contacts.map((contact, index) => (
        <View key={contact.id} style={styles.contactContainer}>
          <Text className="font-bold text-xl">{contact.name}</Text>
          <Text className="text-lg">{contact.phoneNumber}</Text>
        </View>
      ))}
    </View>
    <View style={styles.plusContainer}>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setShowPopup(true)}
      >
        <Plus size={20} color="white"/>
      </TouchableOpacity>
    </View>
    <Modal
      transparent={true}
      visible={showPopup}
      animationType="slide"
    >
      <View style={styles.popupContainer}>
        <View style={styles.popup}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            onChangeText={text => setPhoneNumber(text)}
            keyboardType="phone-pad"
          />
            
          <Button title="Submit" onPress={handleSubmitForm} />
          <Button title="Cancel" onPress={() => setShowPopup(false)} />
        </View>
      </View>
    </Modal>
  </>
  );
};

const MessageScreen = () => {
  const [message, setMessage] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messageCollection = firestore.collection('sosmessage');
        const messagesSnapshot = await messageCollection.get();
        const messagesData = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessage(messagesData);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();
  }, []);

  const handleMessageSubmitForm = async () => {
    if (!newMessageText) {
      alert("Please fill the message in the field");
      return;
    }

    try {
      const messageCollection = firestore.collection('sosmessage');
      await messageCollection.add({ message: newMessageText });

      const updatedMessagesSnapshot = await messageCollection.get();
      const updatedMessagesData = updatedMessagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessage(updatedMessagesData);

      setShowPopup(false);

      console.log("Message created: ", newMessageText);
      // onMessageCreated(newMessageText);

      console.log("Message sent successfully!!");


    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  return (
    <>
      {message.length === 0 ? (
        <Text className="text-center mt-8 font-bold text-xl">No Messages</Text>
      ) : (
        <Text className="text-center mt-8 font-bold text-xl">Your Messages</Text>
      )}
      <View style={styles.message}>
        {message.map((message, index) => (
          <View key={message.id} style={styles.messageContainer}>
            <Text style={styles.messageInfo}>{message.message}</Text>
          </View>
        ))}
      </View>
      <View style={styles.plusContainer}>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setShowPopup(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={showPopup}
        animationType='slide'
      >
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <TextInput
              style={styles.input}
              placeholder='Message'
              onChangeText={text => setNewMessageText(text)}
            />
            <Button
              title="Submit"
              onPress={handleMessageSubmitForm}
            />
            <Button
              title="Cancel"
              onPress={() => setShowPopup(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const SosScreen = ({ contacts }) => {

  const navigation = useNavigation();
  const [message, setMessage] = useState([]);

  useEffect(() => {
    handleSendHelpSMS();
  }, [message]);
  
  const handleSendHelpSMS = async () => {
    const helpMessage = "I need help!";
    const phoneNumbers = contacts ? contacts.map(contact => contact.phoneNumber) : [];
    
    console.log('Phone Numbers:', phoneNumbers);
  
    // Log all messages
    console.log('Messages:');
    message.forEach(msg => console.log(msg.message));
  
    try {
      for (const phoneNumber of phoneNumbers) {
        await SMS.sendSMSAsync(phoneNumber, helpMessage);
      }
      console.log('Help SMS sent successfully');
  
      const messageText = message.length > 0 ? message[0].message : '';
      console.log('Message Text:', messageText);
  
      if (messageText) {
        try {
          for (const phoneNumber of phoneNumbers) {
            await SMS.sendSMSAsync(phoneNumber, messageText);
          }
          console.log('Message sent successfully');
        } catch (error) {
          console.error('Failed to send Message');
          console.error(error);
        }
      } else {
        console.log('No message to send');
      }
    } catch (error) {
      console.error('Failed to send Help SMS');
      console.error(error);
    }
  };
  
  
  

  return (
    <>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start mt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
          >
            <ArrowLeftIcon size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>SOS System</Text>
        </View>
      </SafeAreaView>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? require('../assets/images/home (1) 1.png')
                : require('../assets/images/home (1) 1.png');
            } else if (route.name === 'Contacts') {
              iconName = focused
                ? require('../assets/images/contact-book (1) 1.png')
                : require('../assets/images/contact-book (1) 1.png');
            } else if (route.name === 'Message') {
              iconName = focused
                ? require('../assets/images/menu 1.png')
                : require('../assets/images/menu 1.png');
            }

            return <Image source={iconName} style={styles.tabIcon} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          options={{
            headerShown: false,
          }}
        >
          {() => <HomeScreen handleSendHelpSMS={handleSendHelpSMS} message={message} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Contacts" 
          component={ContactsScreen} 
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="Message" 
          component={MessageScreen} 
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default SosScreen;

const styles = StyleSheet.create({
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
  submitButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: 100,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  contactContainer: {
    padding: 40,
    backgroundColor: '#39B68D',
    borderRadius: 20,
    marginTop: 20,
    paddingBottom: 18,
    paddingTop: 18,
  },
  message: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  messageContainer: {
    padding: 40,
    backgroundColor: '#39B68D',
    borderRadius: 20,
    marginTop: 20,
    paddingBottom: 18,
    paddingTop: 18,
  }
});
