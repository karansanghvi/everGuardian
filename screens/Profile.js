import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { auth, firestore } from "../config";
import { firebase } from "../config";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await firestore
          .collection("users")
          .doc(currentUser.uid)
          .get();
        const userData = userDoc.data();
        setUser(userData);
        setNewName(userData.name);
        setNewPhoneNumber(userData.phone);
        setConfirmationCode(userData.confirmationCode);
      }
    };

    fetchUserData();
  }, []);

  const saveChanges = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await firestore.collection("users").doc(currentUser.uid).update({
          name: newName,
          phone: newPhoneNumber,
        });

        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate("Welcome");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <LinearGradient className="flex-1 bg-white" colors={["#007260", "#39B68D"]}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
          >
            <ArrowLeftIcon size="20" color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-2">
          <Text className="text-4xl text-white font-extrabold mt-4">
            Your Profile
          </Text>
        </View>
      </SafeAreaView>
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
            {user && (
              <>
                {/* ... (previous JSX) */}
                <View style={styles.profileInfo}>
                  <Text style={styles.label}>Confirmation Code:</Text>
                  <Text style={styles.value}>{confirmationCode}</Text>
                </View>
              </>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.label}>User Type:</Text>
              <Text style={styles.value}>{user.userType}</Text>
            </View>
            {editing ? (
              <TouchableOpacity
                className="py-3 bg-black rounded-lg"
                onPress={saveChanges}
              >
                <Text className="text-lg text-white text-center font-extrabold">
                  Save Changes
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="py-3 bg-black rounded-lg"
                onPress={() => setEditing(true)}
              >
                <Text className="text-lg text-white text-center font-extrabold">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => handleLogout()}
            >
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    color: "black",
    marginBottom: 5,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#007260",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    color: "black",
  },
  logoutButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
