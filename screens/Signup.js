// Import the necessary components and functions
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { auth, firestore } from "../config";

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("");

  // Function to handle user sign-up
  const handleSignUp = async () => {
    try {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredentials.user;
  
      console.log('User created:', user);
  
      // Add user data to Firestore
      await firestore
        .collection("users")
        .doc(user.uid)
        .set({
          name: `${firstName} ${lastName}`,
          phone: phoneNumber,
          email: user.email,
          userId: user.uid,
          userType: userType,
        });
  
      console.log('Firestore data set successfully');
  
      navigation.navigate("Profile");
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert(error.message);
    }
  };
  
  // Function to handle user sign-out
  // const handleSignOut = () => {
  //   auth
  //     .signOut()
  //     .then(() => {
  //       navigation.replace("Login"); // Navigate to the "Login" screen after sign-out
  //     })
  //     .catch((error) => alert(error.message));
  // };


  // const handleSignupButton = () => {
  //   navigation.navigate('Home');
  // }

  return (
    <LinearGradient className="flex-1 bg-white" colors={["#007260", "#39B68D"]}>
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
          <Text className="text-4xl text-white font-extrabold mt-4">
            Create An Account
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView style={{ flex: 1 }}>
        <View className="rounded-tl-2xl rounded-tr-2xl flex-1 bg-white px-8 pt-8 mt-6">
          <View className="form space-y-2">
            <Text className="text-black ml-1 text-lg">Enter First Name:</Text>
            <TextInput
              className="p-4 bg-gray-100 text-black rounded-xl mb-3"
              placeholder="First Name"
              onChangeText={(text) => setFirstName(text)}
              autoCapitalize="none"
              value={firstName}
              autoCorrect={false}
            />
            <Text className="text-black ml-1 text-lg">Enter Last Name:</Text>
            <TextInput
              className="p-4 bg-gray-100 text-black rounded-xl mb-3"
              placeholder="Last Name"
              onChangeText={(text) => setLastName(text)}
              autoCapitalize="none"
              autoCorrect={false}
              value={lastName}
            />
            <Text className="text-black ml-1 text-lg">Enter Phone Number:</Text>
            <TextInput
              className="p-4 bg-gray-100 text-black rounded-xl mb-3"
              placeholder="Phone Number"
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={(number) => setPhoneNumber(number)}
            />
            <Text className="text-black ml-1 text-lg">
              Enter Email Address:
            </Text>
            <TextInput
              className="p-4 bg-gray-100 text-black rounded-xl mb-3"
              placeholder="Email Address"
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              keyboardType="email-address"
            />
            <Text className="text-black ml-1 text-lg">Enter Password:</Text>
            <TextInput
              className="p-4 bg-gray-100 text-black rounded-xl mb-3"
              secureTextEntry
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
              value={password}
              autoCorrect={false}
            />
            <Text className="text-black ml-1 text-lg">Select User Type:</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  userType === "elderly" && styles.selectedRadioButton,
                ]}
                onPress={() => setUserType("elderly")}
              >
                <Text style={styles.radioText}>Elderly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  userType === "guardian" && styles.selectedRadioButton,
                ]}
                onPress={() => setUserType("guardian")}
              >
                <Text style={styles.radioText}>Guardian</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="flex items-end">
              <Text className="text-black mb-2">Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3 bg-black rounded-lg"
              // onPress={registerUser}
              onPress={() =>
                handleSignUp()
              }
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
                <Image
                  source={require("../assets/images/google.png")}
                  className="w-10 h-10"
                />
                <Text className="text-black text-lg ml-2">
                  Sign In With Google
                </Text>
              </View>
            </TouchableOpacity>
            <View className="flex-row justify-center mt-7">
              <Text className="text-gray-500 font-semibold">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text className="font-semibold text-green mb-8"> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Signup;

const styles = StyleSheet.create({
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "lightgray",
    marginHorizontal: 4,
  },
  orText: {
    color: "black",
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  selectedRadioButton: {
    backgroundColor: 'black',
    color: 'white'
  },
  radioText: {
    color: 'black',
  },
});
