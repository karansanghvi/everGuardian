import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login, Welcome, Signup, Home } from './screens'; 
import { firebase } from './config';
import { useEffect, useState } from 'react';

const Stack = createNativeStackNavigator()

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
      <Stack.Navigator
        initialRouteName='Welcome'
      >
        {!user ? (
          <>
            <Stack.Screen 
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Login"
              component={Login}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Signup"
              component={Signup}
              options={{
                headerShown: false
              }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Home"
            component={Home}
            options={{
              headerShown: false
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;