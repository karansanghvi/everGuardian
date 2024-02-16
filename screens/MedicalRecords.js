import { 
  View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, Platform, Button
 } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import {ArrowLeftIcon} from 'react-native-heroicons/solid'
import { Dropdown } from 'react-native-element-dropdown'
import AntDesign from '@expo/vector-icons/AntDesign'
// import DateTimePicker from '@react-native-community/datetimepicker'

const MedicalRecords = () => {

  const [bloodGroup, setBloodGroup] = useState(null);
  const [gender, setGender] = useState(null);
  // const [date, setDate] = useState(new Date());
  // const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login');
  }

  const handleSignupButton = () => {
    navigation.navigate('Home');
  }

  // const handleDateChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShowDatePicker(Platform === 'ios');
  //   setDate(currentDate);
  // };

  // const showDatePickerModal = () => {
  //   setShowDatePicker(true);
  // };

  const bloodGroupData = [
    { label: 'A+', value: '1' },
    { label: 'O+', value: '2' },
    { label: 'B+', value: '3' },
    { label: 'AB+', value: '4' },
    { label: 'A-', value: '5' },
    { label: 'O-', value: '6' },
    { label: 'B-', value: '7' },
    { label: 'AB-', value: '8' },
  ];

  const genderData = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' },
    { label: 'Other', value: '3' },
  ]

  return (
    <LinearGradient
      className="flex-1 bg-white"
      colors={['#007260', '#39B68D']} 
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
          <Text className="text-4xl text-white font-extrabold mt-4">Medical Records</Text>
        </View>
      </SafeAreaView>
      {/* <ScrollView style={{ flex: 1 }}> */}
        <View className="rounded-tl-2xl rounded-tr-2xl flex-1 bg-white px-8 pt-8 mt-6">
          <View className="form space-y-2">
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={bloodGroupData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Blood Group"
              searchPlaceholder='Search...'
              value={bloodGroup}
              onChange={item => {
                setBloodGroup(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
              )}
            />
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={genderData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                searchPlaceholder='Search...'
                value={gender}
                onChange={item => {
                  setGender(item.value);
                }}
                renderLeftIcon={() => (
                  <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                )}
            />          
            {/* <Text className="text-black ml-1 text-lg">Enter Birth Date:</Text>
              <Button
                title="Select Date"
                onPress={showDatePickerModal}
              />
              {
                showDatePicker && (
                  <DateTimePicker
                    testID='dateTimePicker'
                    value={date}
                    mode='date'
                    is24Hour={true}
                    display='default'
                    onChange={handleDateChange}
                  />
                )
              } */}
            <Text className="text-black ml-1 text-lg">Enter Address:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='Address'
              />
            <Text className="text-black ml-1 text-lg">Any Alergy?</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='Alergy'
              />
            <Text className="text-black ml-1 text-lg">Enter Current Medications:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='Current Medications'
              />
            <Text className="text-black ml-1 text-lg">Enter Current Medications:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='Current Medications'
              />
              <TouchableOpacity 
                className="py-3 bg-black rounded-lg"
                onPress={handleSignupButton}
              >
                <Text className="text-lg text-white text-center font-extrabold">
                  Submit
                </Text>
              </TouchableOpacity>
          </View>
        </View>
      {/* </ScrollView> */}
    </LinearGradient>
  )
}

export default MedicalRecords

const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'lightgray',
    marginHorizontal: 4,
  },
  orText: {
    color: 'black',
    fontSize: 16,
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
