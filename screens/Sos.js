import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import Plus from '../components/Plus';
import { firestore } from '../config'; 
import * as SMS from 'expo-sms';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ handleSendHelpSMS, message }) => {
  return (
    <>
      <Text style={styles.emergencytext}>Having An Emergency?</Text>
      <Text style={styles.helptext}>Press the below button to get help</Text>
      <View style={styles.button}>
        <TouchableOpacity
          onPress={handleSendHelpSMS}
          style={styles.buttonName}
        >
          <Text style={styles.buttonText}>HELP ME</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ContactsScreen = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editingContactId, setEditingContactId] = useState(null);
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

  const handleDeleteContact = async (contactId) => {
    try {
      await firestore.collection("contacts").doc(contactId).delete();
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
      console.log("Contact deleted successfully!!");
    } catch (error) {
      console.error("Error deleting contact: ", error);
    }
  };

  const handleEditContact = (contactId) => {
    const contactToEdit = contacts.find(contact => contact.id === contactId);
    setName(contactToEdit.name);
    setPhoneNumber(contactToEdit.phoneNumber);
    setEditingContactId(contactId);
    setShowPopup(true);
  };

  const handleUpdateContact = async () => {
    if (!name || !phoneNumber) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      await firestore.collection("contacts").doc(editingContactId).update({
        name: name,
        phoneNumber: phoneNumber,
      });

      const updatedContactsSnapshot = await firestore.collection("contacts").get();
      const updatedContactsData = updatedContactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(updatedContactsData);

      setShowPopup(false);
      console.log("Contact updated successfully!!");
    } catch (error) {
      console.error("Error updating contact: ", error);
    }
  };

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
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };
  

  return (
    <>
      {contacts.length === 0 ? (
        <Text className="text-center mt-8 font-bold text-xl">No Contacts</Text>
      ) : (
        <Text className="text-center mt-8 font-bold text-xl">Your Contacts</Text>
      )}
      <View style={styles.message}>
        {contacts.map((contact, index) => (
          <View key={contact.id} style={styles.contactContainer}>
            <Text className="font-bold text-xl">{contact.name}</Text>
            <Text className="text-lg">{contact.phoneNumber}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditContact(contact.id)}
              >
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteContact(contact.id)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.plusContainer}>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => {
            setName('');
            setPhoneNumber('');
            setEditingContactId(null);
            setShowPopup(true);
          }}
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
            <Text className="text-center text-lg mb-4 font-bold">Add Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={text => setName(text)}
              value={name}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              onChangeText={text => setPhoneNumber(text)}
              keyboardType="phone-pad"
              value={phoneNumber}
            />
            <View style={styles.bothButtonContainer}>
              <TouchableOpacity
                onPress={editingContactId ? handleUpdateContact : handleSubmitForm}
                style={styles.buttonContainerSubmit}
              >
                <Text className="text-black text-lg font-semibold">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowPopup(false)}
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
};


const MessageScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
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
        setMessages(messagesData);
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
      setMessages(updatedMessagesData);

      setShowPopup(false);

      console.log("Message created: ", newMessageText);
      console.log("Message sent successfully!!");

    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await firestore.collection('sosmessage').doc(messageId).delete();
      setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
      console.log("Message deleted successfully!!");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  const handleEditMessage = (messageId) => {
    const messageToEdit = messages.find(message => message.id === messageId);
    setNewMessageText(messageToEdit.message);
    setEditingMessageId(messageId);
    setShowPopup(true);
  };

  const handleUpdateMessage = async () => {
    if (!newMessageText) {
      alert("Please fill the message in the field");
      return;
    }

    try {
      await firestore.collection('sosmessage').doc(editingMessageId).update({
        message: newMessageText,
      });

      const updatedMessagesSnapshot = await firestore.collection('sosmessage').get();
      const updatedMessagesData = updatedMessagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(updatedMessagesData);

      setShowPopup(false);
      console.log("Message updated successfully!!");
    } catch (error) {
      console.error("Error updating message: ", error);
    }
  };

  return (
    <>
      {messages.length === 0 ? (
        <Text className="text-center mt-8 font-bold text-xl">No Messages</Text>
      ) : (
        <Text className="text-center mt-8 font-bold text-xl">Your Messages</Text>
      )}
      <View style={styles.message}>
        {messages.map((message, index) => (
          <View key={message.id} style={styles.messageContainer}>
            <Text className="text-lg font-semibold">{message.message}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditMessage(message.id)}
              >
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMessage(message.id)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.plusContainer}>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => {
            setNewMessageText('');
            setEditingMessageId(null);
            setShowPopup(true);
          }}
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
            <Text className="text-center text-lg mb-4 font-bold">Add Message</Text>
            <TextInput
              style={styles.input}
              placeholder='Message'
              onChangeText={text => setNewMessageText(text)}
              value={newMessageText}
            />
            <View style={styles.bothButtonContainer}>
              <TouchableOpacity
                onPress={editingMessageId ? handleUpdateMessage : handleMessageSubmitForm}
                style={styles.buttonContainerSubmit}
              >
                <Text className="text-lg font-semibold">{editingMessageId ? "Update" : "Submit"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowPopup(false);
                  setNewMessageText('');
                  setEditingMessageId(null);
                }}
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
};

const SosScreen = ({ contacts, messages }) => {

  const navigation = useNavigation();
  const [message, setMessage] = useState([]);

  const handleSendHelpSMS = async () => {
    const helpMessage = "I need help!";
    const phoneNumbers = contacts ? contacts.map(contact => contact.phoneNumber) : [];
    const messageText = messages && messages.length > 0 ? messages[0].message : '';

    try {
      for (const phoneNumber of phoneNumbers) {
        await SMS.sendSMSAsync(phoneNumber, helpMessage);

        if (messageText) {
          await SMS.sendSMSAsync(phoneNumber, messageText);
        }
      }
      console.log('Help SMS sent successfully');
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
  },
  button: {
    marginTop: 140,
    backgroundColor: '#39B68D',
    paddingVertical: 30,
    marginHorizontal: 90,
    borderRadius: 20,
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
