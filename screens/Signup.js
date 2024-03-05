import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { auth, firestore, firebase } from "../config"; // Assuming you have correctly configured your Firebase
import { EyeIcon, EyeOffIcon } from "react-native-heroicons/solid";

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    try {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredentials.user;

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
          confirmationCode:
            userType === "elderly" ? generateConfirmationCode() : null,
        });

      navigation.navigate("Home", { firstName: firstName });
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert(error.message);
    }
  };

  const generateConfirmationCode = () => {
    // Generate a 6-digit random confirmation code
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleConnect = async () => {
    try {
      const userSnapshot = await firestore
        .collection("users")
        .where("confirmationCode", "==", confirmationCode)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const elderlyUserId = userDoc.data().userId;

        let guardianUserId;

        if (userType === "elderly") {
          // If the user is elderly, get the guardian user id from your database or other source
          guardianUserId = "your_guardian_user_id";
        } else {
          // If the user is a guardian, perform the signup part
          const userCredentials = await auth.createUserWithEmailAndPassword(
            email,
            password
          );
          const user = userCredentials.user;

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
              confirmationCode: null, // Assuming guardians don't have confirmation codes
            });

          guardianUserId = user.uid;
        }

        // Import serverTimestamp from the correct location
        const { serverTimestamp } = firebase.firestore.FieldValue;

        // Create a new document in the "connections" collection
        await firestore.collection("connections").add({
          guardianUserId,
          elderlyUserId,
          timestamp: serverTimestamp(), // Use serverTimestamp here
        });

        navigation.navigate('Home');
        console.log("Connected to user with userId:", elderlyUserId);
      } else {
        alert("Invalid confirmation code");
      }
    } catch (error) {
      console.error("Error during connection:", error);
      alert(error.message);
    }
  };

  const formatPhoneNumber = (inputNumber) => {
    // Remove all non-numeric characters from the input
    const numericOnly = inputNumber.replace(/[^0-9]/g, "");
    setPhoneNumber(numericOnly);
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    keyboardShouldPersistTaps= "handled"
  >

    <LinearGradient
      style={{ flex: 1, backgroundColor: "#007260" }}
      colors={["#007260", "#39B68D"]}
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
              onChangeText={(text) => {
                const alphabetsOnlyForFirstName = text.replace(
                  /[^A-Za-z]/g,
                  ""
                );
                setFirstName(alphabetsOnlyForFirstName);
              }}
              autoCapitalize="none"
              value={firstName}
              autoCorrect={false}
            />

            <Text className="text-black ml-1 text-lg">Enter Last Name:</Text>
            <TextInput
              className="p-4 bg-gray-100 text-black rounded-xl mb-3"
              placeholder="Last Name"
              onChangeText={(text) => {
                const alphabetsOnlyForLastName = text.replace(/[^A-Za-z]/g, "");
                setLastName(alphabetsOnlyForLastName);
              }}
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
              onChangeText={(number) => formatPhoneNumber(number)}
            />

            <Text className="text-black ml-1 text-lg">
              Enter Email Address:
            </Text>
            <TextInput
              className="p-4 bg-gray-100 text-black rounded-xl mb-3"
              placeholder="Email Address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => {
                setEmail(text);
              }}
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
              <TouchableOpacity onPress={() => setUserType("elderly")}>
                <View
                  style={[
                    styles.radioButton,
                    userType === "elderly" && styles.selectedRadioButton,
                  ]}
                >
                  <Text style={styles.radioText}>Elderly</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setUserType("guardian")}>
                <View
                  style={[
                    styles.radioButton,
                    userType === "guardian" && styles.selectedRadioButton,
                  ]}
                >
                  <Text style={styles.radioText}>Guardian</Text>
                </View>
              </TouchableOpacity>
            </View>
            {userType === "elderly" && (
              <View>
                <Text className="text-black ml-1 text-lg">
                  Confirmation Code:
                </Text>
                <TextInput
                  style={{ ...styles.input, fontWeight: "bold" }} // Apply bold style to placeholder text
                  className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                  placeholder={generateConfirmationCode()} // Set placeholder to a random 6-digit number
                  value={confirmationCode}
                  onChangeText={(code) => setConfirmationCode(code)}
                  editable={false} // Elderly's code is not editable
                />
              </View>
            )}

            {userType === "guardian" && (
              <View>
                <Text className="text-black ml-1 text-lg">
                  Enter Confirmation Code:
                </Text>
                <TextInput
                  className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                  placeholder="Enter Code"
                  value={confirmationCode}
                  onChangeText={(code) => setConfirmationCode(code)}
                />
              </View>
            )}
            <TouchableOpacity
              className="py-3 bg-black rounded-lg"
              onPress={userType === "elderly" ? handleSignUp : handleConnect}
            >
              <Text className="text-lg text-white text-center font-extrabold">
                {userType === "elderly" ? "Signup" : "Connect"}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
  className="py-3 bg-black rounded-lg"
  onPress={handleSignUp}
>
  <Text className="text-lg text-white text-center font-extrabold">
    {userType === "elderly" ? "Signup" : "Connect"}
  </Text>
</TouchableOpacity> */}

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
    </ScrollView>

  );
};


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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
  },
  selectedRadioButton: {
    backgroundColor: "black",
    color: "white",
  },
  radioText: {
    color: "black",
  },
});

export default Signup;
