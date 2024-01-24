import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import COLORS from '../assets/constants/colors';

const Welcome = () => {

    const navigation = useNavigation();

    const handleGetStarted = () => {
        navigation.navigate('Login');
    }

  return (
    <LinearGradient
        style={{
            flex: 1,
        }}
        colors={[COLORS.secondary, COLORS.primary]}
    >
        <View style={{flex: 1}}>
            <View className="flex items-center justify-center">
                <Image
                    source={require("../assets/images/old_male.png")}
                    style={{
                        borderRadius: 20,
                        position: "absolute",
                        top: 120,
                        width: 340,
                        height: 400
                    }}
                />
            </View>

            <View style={{
                paddingHorizontal: 22,
                position: "absolute",
                top: 580,
                width: "100%"
            }}>
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
                        style={{
                            backgroundColor: 'black',
                            padding: 15,
                            paddingLeft: 80,
                            paddingRight: 80,
                            borderRadius: 15,
                        }}
                        onPress={handleGetStarted}
                    >
                        <Text style={{ color: COLORS.white, fontSize: 18 }}>
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