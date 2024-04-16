import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

const DetailsScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
        <View className="flex-row justify-start mt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
          >
            <ArrowLeftIcon size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Medical Reminders</Text>
        </View>
    </SafeAreaView>
  );
}

export default DetailsScreen;
