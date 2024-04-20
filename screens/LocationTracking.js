import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import * as Location from "expo-location";
import { firestore, auth } from "../config";

const LocationTracking = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userType, setUserType] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await firestore
            .collection("users")
            .doc(currentUser.uid)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log("Fetched user data:", userData);
            setUserType(userData.userType);
            setConfirmationCode(userData.confirmationCode);
          } else {
            console.log("User data not found");
          }
        }
      } catch (error) {
        // console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [setUserType, setConfirmationCode]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        setErrorMessage("Permission to access location was denied");
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        updateLocationInFirestore(currentLocation);
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMessage("Error getting location");
      }
    })();
  }, []);

  const updateLocationInFirestore = async (currentLocation) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const locationData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          cCode: confirmationCode,
        };

        await firestore
          .collection("location")
          .doc(currentUser.uid)
          .set(locationData);
      }
    } catch (error) {
      console.error("Error updating location in Firestore:", error);
    }
  };



  return (
    <>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start mt-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
          >
            <ArrowLeftIcon size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Location Tracking</Text>
        </View>
      </SafeAreaView>
      {userType === "elderly" ? (
        <ElderlyLocationTracking
          location={location}
          errorMessage={errorMessage}
          confirmationCode={confirmationCode}
          userType={userType}
        />
      ) : (
        <GuardianLocationTracking
          guardianLocation={location}
          confirmationCode={confirmationCode}
          // name={userName}
          userType={userType}
          setUserType={setUserType}
        />
      )}
    </>
  );
};
const ElderlyLocationTracking = ({
  location,
  errorMessage,
  confirmationCode,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <Text className="text-center text-lg">Your are seeing your location</Text>
      {errorMessage ? (
        <Text>{errorMessage}</Text>
      ) : location ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};


const GuardianLocationTracking = ({ confirmationCode, userType }) => {
  const [elderlyLocation, setElderlyLocation] = useState(null);
  const [elderlyName, setElderlyName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await firestore
            .collection("users")
            .doc(currentUser.uid)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserType(userData.userType);
            setConfirmationCode(userData.confirmationCode);
          } else {
            console.log("User data not found");
          }
        }
      } catch (error) {
        // console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchElderlyLocation = async () => {
      try {
        if (userType === "guardian" && confirmationCode) {
          const elderlyUserQuery = await firestore
            .collection("users")
            .where("confirmationCode", "==", confirmationCode)
            .get();

          if (!elderlyUserQuery.empty) {
            const elderlyUserData = elderlyUserQuery.docs[0].data();
            console.log("Elderly User Data:", elderlyUserData);
            setElderlyName(elderlyUserData.name);

            const elderlyLocationDoc = await firestore
              .collection("location")
              .doc(elderlyUserData.userId)
              .get();

            if (elderlyLocationDoc.exists) {
              const elderlyLocationData = elderlyLocationDoc.data();
              setElderlyLocation({
                latitude: elderlyLocationData.latitude,
                longitude: elderlyLocationData.longitude,
              });
            } else {
              console.log("No location data found for the elderly");
            }
          } else {
            console.log("No user found with confirmation code:", confirmationCode);
          }
        }
      } catch (error) {
        console.error("Error fetching elderly location:", error);
      } finally {
        setLoading(false);
      }
    };

    if (confirmationCode && userType === "guardian") {
      fetchElderlyLocation();
    } else {
      setLoading(false);
    }
  }, [confirmationCode, userType]);


  return (
    <View style={{ flex: 1 }}>
      <Text className="text-center text-lg">You are seeing {elderlyName}'s location</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : elderlyLocation ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: elderlyLocation.latitude,
              longitude: elderlyLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: elderlyLocation.latitude,
                longitude: elderlyLocation.longitude,
              }}
              title={`Location of ${elderlyName}`}
            />
          </MapView>
          {/* <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              Latitude: {elderlyLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Longitude: {elderlyLocation.longitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Elderly User Name: {elderlyName}
            </Text>
          </View> */}
        </>
      ) : (
        <Text>No location data available for the elderly.</Text>
      )}
    </View>
  );
};

export default LocationTracking;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d1d1d",
    marginTop: 20,
    marginLeft: 60,
  },
  map: {
    flex: 1,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  coordinatesContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  coordinatesText: {
    fontSize: 16,
    color: "#333",
  },
});
