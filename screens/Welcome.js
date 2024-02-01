import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

const Welcome = () => {

    const navigation = useNavigation();

    const handleGetStarted = () => {
        navigation.navigate('Login');
    }

  return (
    <LinearGradient
        className="flex-1"
        colors={['#007260', '#39B68D']}
    >
        <View style={styles.imageContainer}>
            <View className="flex items-center justify-center">
                <Image
                    source={require("../assets/images/old_male.png")}
                    style={styles.mainImage}
                />
            </View>

            <View style={styles.contextContainer}>
                <Text className="text-5xl font-extrabold text-white">
                    EverGuardian
                </Text>
                <View className="my-22">
                    <Text className="text-base text-white my-4 mt-2">
                        Your Trusted Support For Every Journey In Life!!
                    </Text>
                </View>

                <View className="flex items-center justify-center">
                    <TouchableOpacity
                        className="bg-black p-4 pl-20 pr-20 rounded-lg"
                        onPress={handleGetStarted}
                    >
                        <Text className="text-white text-lg font-extrabold">
                            Get Started
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </LinearGradient>
  )
}

export default Welcome

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1
    },
    mainImage: {
        borderRadius: 20,
        position: "absolute",
        top: Platform.OS === 'ios' ? 120 : 100, 
        width: 340,
        height: 400
    },
    contextContainer: {
        paddingHorizontal: 22,
        position: "absolute",
        top: Platform.OS === 'ios' ? 530 : 500, 
        width: "100%"
    }
});