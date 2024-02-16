import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { auth, firestore } from '../config';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        setUser(userData);
        setNewName(userData.name);
        setNewPhoneNumber(userData.phone);
      }
    };

    fetchUserData();
  }, []);

  const saveChanges = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await firestore.collection('users').doc(currentUser.uid).update({
          name: newName,
          phone: newPhoneNumber,
        });

        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
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
          <Text className="text-4xl text-white font-extrabold mt-4">Profile</Text>
        </View>
      </SafeAreaView>
      <ScrollView style={{ flex: 1 }}>
        <View className="rounded-tl-2xl rounded-tr-2xl flex-1 bg-white px-8 pt-8 mt-6">
          {user && (
            <>
              <View style={styles.profileInfo}>
                <Text style={styles.label}>Name:</Text>
                {editing ? (
                  <TextInput
                    style={styles.input}
                    value={newName}
                    onChangeText={(text) => setNewName(text)}
                  />
                ) : (
                  <Text style={styles.value}>{user.name}</Text>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.label}>Phone Number:</Text>
                {editing ? (
                  <TextInput
                    style={styles.input}
                    value={newPhoneNumber}
                    onChangeText={(text) => setNewPhoneNumber(text)}
                  />
                ) : (
                  <Text style={styles.value}>{user.phone}</Text>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.label}>User Type:</Text>
                <Text style={styles.value}>{user.userType}</Text>
              </View>
              {editing ? (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveChanges}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditing(true)}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
export default Profile;


const styles = StyleSheet.create({
  profileInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: 'black',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#007260',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    color: 'black',
  },
  editButton: {
    backgroundColor: '#007260',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#39B68D',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

