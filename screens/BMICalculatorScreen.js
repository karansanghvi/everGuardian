import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {ArrowLeftIcon} from 'react-native-heroicons/solid'
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const BMICalculatorScreen = () => {

  const navigation = useNavigation();

  const [gender, setGender] = useState('');
  const [height, setHeight] = useState(160);
  const [weight, setWeight] = useState(60);
  const [age, setAge] = useState(30);
  const [modalVisible, setModalVisible] = useState(false);
  const [bmi, setBMI] = useState(null);
  const [bmiCategory, setBMICategory] = useState('');

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const calculateBMI = () => {
    if (height && weight && age && gender) {
      const heightInMeters = height / 100; 
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBMI(bmiValue.toFixed(2));

      if (bmiValue < 18.5) {
        setBMICategory('Underweight');
      } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
        setBMICategory('Healthy');
      } else if (bmiValue >= 25 && bmiValue <= 29.9) {
        setBMICategory('Overweight');
      } else {
        setBMICategory('Obese');
      }

      toggleModal();
    } else {
      alert('Please fill in all the details.');
    }
  };

  const incrementWeight = () => {
    setWeight(weight + 1);
  };

  const decrementWeight = () => {
    if (weight > 0) {
        setWeight(weight -1);
    }
  };

  const incrementAge = () => {
    setAge(age + 1);
  };

  const decrementAge = () => {
    if (age > 0) {
        setAge(age - 1);
    } 
  };

  return (
    <>
        <SafeAreaView className="flex">
            <View className="flex-row justify-start mt-4">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-8"
                >
                    <ArrowLeftIcon size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>BMI Calculator</Text>
            </View>
        </SafeAreaView>
        <View style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setGender('male')}>
                    <View
                        style={[
                        styles.radioButton,
                        gender === 'male' && styles.selectedRadioButton,
                        gender === null && styles.unselectedRadioButton,
                        ]}
                    >
                        <Ionicons
                        name="male-outline"
                        size={75}
                        style={[styles.radioIcon, gender === 'male' && styles.selectedRadioText]}
                        />
                        <Text style={[styles.radioText, gender === 'male' && styles.selectedRadioText]}>Male</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setGender('female')}>
                    <View
                        style={[
                        styles.radioButton,
                        gender === 'female' && styles.selectedRadioButton,
                        gender === null && styles.unselectedRadioButton,
                        ]}
                    >
                        <Ionicons
                        name="female-outline"
                        size={75}
                        style={[styles.radioIcon, gender === 'female' && styles.selectedRadioText]}
                        />
                        <Text style={[styles.radioText, gender === 'female' && styles.selectedRadioText]}>Female</Text>
                    </View>
                    </TouchableOpacity>
                </View>
            </View>
          <View className="mt-8" style={styles.heightContainer}>
            <Text className="text-center font-bold text-xl">Height</Text>
            <View className="mt-4">
                <Text className="text-center"><Text className="text-6xl font-extrabold">{height}</Text> cm</Text>
            </View>
            <Slider
                style={{width: '100%', height: 40}}
                minimumValue={1}
                maximumValue={1000}
                step={1}
                value={height}
                onValueChange={value => setHeight(value)}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={styles.counterContainer}>
                <Text className="text-center text-xl font-bold">Weight</Text>
                <Text className="text-center text-6xl font-extrabold mt-4">{weight}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={decrementWeight} style={styles.button}>
                        <Text className="text-white text-4xl">-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={incrementWeight} style={styles.buttonTwo}>
                        <Text className="text-white text-4xl">+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.counterContainer}>
                <Text className="text-center text-xl font-bold">Age</Text>
                <Text className="text-center text-6xl font-extrabold mt-4">{age}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={decrementAge} style={styles.button}>
                        <Text className="text-white text-4xl">-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={incrementAge} style={styles.buttonTwo}>
                        <Text className="text-white text-4xl">+</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
          <View className="flex items-center justify-center mt-4">
            <TouchableOpacity 
              onPress={calculateBMI}
              className="bg-black p-4 pl-20 pr-20 rounded-lg"
            >
              <Text className="text-white text-lg font-extrabold">Calculate Your BMI</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Your BMI Calculator UI */}
            <TouchableOpacity onPress={calculateBMI}>
              <Text>Calculate Your BMI</Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={toggleModal}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                  <View className="flex-row">
                    <Text className="font-bold text-lg">Your BMI:</Text>
                    <Text className="text-lg"> {bmi}</Text>
                  </View>
                  <View className="flex-row">
                    <Text className="font-bold text-lg">Category:</Text>
                    <Text className="text-lg"> {bmiCategory}</Text>
                  </View>
                  <TouchableOpacity onPress={toggleModal} style={{ marginTop: 20, backgroundColor: 'black', padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
    </>
  );
};

const styles =  {
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
    marginTop: 40,
    marginLeft: 60,
  },
  radioButton: {
    width: 150,
    height: 150,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectedRadioButton: {
    backgroundColor: '#000',
  },
  unselectedRadioButton: {
    backgroundColor: '#fff',
  },
  radioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  radioIcon: {
    height: 75,
    marginTop: 10,
  },
  selectedRadioText: {
    color: '#fff',
  },
  heightContainer: {
    backgroundColor: '#39B68D',
    paddingTop: 10,
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  counterContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 50,
    backgroundColor: '#39B68D',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20,
    borderRadius: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
    marginRight: 20,
  },
  buttonTwo: {
    backgroundColor: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
    marginLeft: 20,
  }
};

export default BMICalculatorScreen;
