import { Login, Welcome, Signup, Home, MedicalRecords } from "./screens";
import Profile from "./screens/Profile";
import { firebase,firestore } from "./config";
import { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPassword from "./screens/ForgotPassword";
import MedicalReminders from "./screens/MedicalReminders";
import LocationTracking from "./screens/LocationTracking";
import Sos from "./screens/Sos";
import EditReminderScreen from "./screens/EditReminderScreen";

const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber();
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {!user ? (
          <>
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
        )}
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="MedicalRecords"
          component={MedicalRecords}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="MedicalReminders"
          component={MedicalReminders}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="EditReminderScreen"
          component={EditReminderScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="LocationTracking"
          component={LocationTracking}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SOS"
          component={Sos}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
