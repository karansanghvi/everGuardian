import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Home = () => {
  return (
    <>
      <View style={styles.container}>
        <View className="mt-4">
          <Image
            source={require('../assets/images/profile-user.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hello Karan!</Text>
          <Text style={styles.welcome}>Welcome to everGuardian!</Text>
        </View>
      </View>
      <View style={styles.welcomeContainer}>
        <Text>hello</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginTop: 12,
  },
  image: {
    width: 50,
    height: 50,
  },
  textContainer: {
    marginLeft: 8,
  },
  greeting: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 14,
  },
  welcomeContainer: {
    backgroundColor: '#39B68D',
    width: 280,
    height: 169
    
  }
});

export default Home;
