import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Button,
} from 'react-native';
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Plus from '../components/Plus';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { firestore, firebase } from "../config"; 

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
};

LocaleConfig.defaultLocale = 'en';

export default function MedicalReminders() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [reminderData, setReminderData] = useState('');
  const [notesData, setNotesData] = useState('');
  const [calendarDate, setCalendarDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submittedData, setSubmittedData] = useState([]);
  const [alarmSound, setAlarmSound] = useState(null);

  useEffect(() => {
    const requestPermission = async() => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkTime();
    }, 1000);
  
    return () => clearInterval(interval);
  }, [selectedTime]);
  
  const checkTime = () => {
    if (selectedTime) {
      const currentDateTime = new Date();
      console.log(
        selectedTime.getHours() + " : " + selectedTime.getMinutes() + " = " + currentDateTime.getHours() + " : " + currentDateTime.getMinutes()
      );
      if (
        selectedTime.getHours() === currentDateTime.getHours() &&
        selectedTime.getMinutes() === currentDateTime.getMinutes()
      ) {
        playAlarmSound();
        setSelectedTime(null);
      }
    }
  };
  

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handlePlusButtonClick = () => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCalendarDate(formattedDate);
      setShowPopup(true);
    } else {
      alert("Please select a date to create a reminder.");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (time) => {
    setSelectedTime(time);
    scheduleAlarm(time);
    hideDatePicker();
    console.log(time);
  };

  const scheduleAlarm = async (time) => {
    try {
      const dateTime = new Date();
      dateTime.setHours(time.getHours());
      dateTime.setMinutes(time.getMinutes());

      const schedulingOptions = {
        content: {
          title: 'Alarm',
          body: 'Time to wake up',
        },
        trigger: {
          date: dateTime.getTime(),
        },
      };

      await Notifications.scheduleNotificationAsync(schedulingOptions);
    } catch(error) {
      console.error('Error scheduling alarm:', error);
    }
  };

  const playAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/alarm.mp3')
      );
      await sound.playAsync();
      setAlarmSound(sound);
      
      const notificationId = await scheduleNotification();
      console.log('Notification scheduled with id:', notificationId);
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  };

  const scheduleNotification = async () => {
    try {
      const notificationContent = {
        title: 'Alarm',
        body: 'Time to wake up',
      };
  
      const schedulingOptions = {
        content: notificationContent,
        trigger: null, 
      };
  
      const notificationId = await Notifications.scheduleNotificationAsync(schedulingOptions);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };
  
  // const dismissAlarm = async () => {
  //   try {
  //     if(alarmSound) {
  //       await alarmSound.stopAsync();
  //       await alarmSound.unloadAsync();
  //       setAlarmSound(null);
  //     }
  //   } catch(error) {
  //     console.error('Error dismissing alarm sound:', error);
  //   }
  // };

  const dismissAlarm = async (sound) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
    } catch (error) {
      console.error('Error dismissing alarm sound:', error);
    }
  };  

  const handleSubmitForm = async () => {
    if(!calendarDate || !reminderData || !notesData) {
      alert("please fill in all the fields");
      return;
    }

    try {
      const remindersCollection = firestore.collection("reminders");

      const newReminder = {
        date: calendarDate,
        reminder: reminderData,
        notes: notesData,
        time: selectedTime.toLocaleTimeString(),
      };

      await remindersCollection.add(newReminder);

      setSubmittedData((prevData) => {
        const existingDataIndex = prevData.findIndex((item) => item.date === calendarDate);
  
        if (existingDataIndex !== -1) {
          const newData = [...prevData];
          newData[existingDataIndex].reminders.push(newReminder);
  
          return newData;
        } else {
          return [...prevData, { date: calendarDate, reminders: [newReminder] }];
        }
      });
  
      setShowPopup(false);
      console.log("Reminder added successfully!!")
    } catch (error) {
      console.error("Error adding reminder: ", error);
    }
  };

  // const handleEditReminderScreen = () => {
  //   navigation.navigate('EditReminderScreen', { dismissAlarmFunction: dismissAlarm });
  // };
  const handleEditReminderScreen = () => {
    navigation.navigate('EditReminderScreen', { dismissAlarmFunction: dismissAlarm, alarmSound: alarmSound });
  };  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View className="flex-row justify-start mt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-black p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
          >
            <ArrowLeftIcon size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Medical Reminders</Text>
        </View>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: 'black' },
            }}
            style={styles.calendar}
          />
          <View>
            {submittedData && submittedData.length > 0 ? (
              <View>
                <Text className="mt-4 text-black font-extrabold text-lg">Your Reminders:</Text>
                <TouchableOpacity onPress={handleEditReminderScreen} className="mb-4">
                  <View className="mb-40 ml-2">
                    {submittedData.map((dateData, index) => (
                      <View key={index}>
                        <Text className="text-black text-md font-semibold mt-4">Reminders for {dateData.date}:</Text>
                        <View style={styles.submittedDataContainer}>
                          {dateData.reminders.map((data, reminderIndex) => (
                            <View key={reminderIndex}>
                              <Text style={styles.submittedData}>Reminder: {data.reminder}</Text>
                              <Text style={styles.submittedData}>Notes: {data.notes}</Text>
                              <Text style={styles.submittedData}>Time: {data.time}</Text>
                              {/* <Button title="Dismiss Alarm" onPress={dismissAlarm} disabled={!alarmSound} /> */}
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="mt-10">
                <Text className="text-black text-lg font-extrabold text-center">
                  {selectedDate ? 'No reminders' : 'Select a date to view reminders'}
                </Text>
              </View>
            )}
          </View>

        </View>
        <View className="mb-40 ml-6">
        
        </View>
        <View style={styles.plusContainer}>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handlePlusButtonClick}
          >
            <Plus size={20} color="white"/>
          </TouchableOpacity>
        </View>
        <Modal
          transparent={true}
          visible={showPopup}
          animationType="slide"
        >
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Text className="text-black text-lg text-center mb-2">{calendarDate}</Text>
              <Text className="text-black ml-1 text-md mb-1">Your Reminder:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3"
                placeholder='Reminder'
                autoCapitalize='none'
                onChangeText={(text) => setReminderData(text)}
                required
              />

              <Text className="text-black ml-1 text-md mb-1">Notes:</Text>
              <TextInput
                className="p-4 bg-gray-100 text-black rounded-xl mb-3 w-300 h-30"
                placeholder='Type something here'
                autoCapitalize='none'
                onChangeText={(text) => setNotesData(text)}
                required
              />

              <Text className="text-black ml-1 text-md mb-1">Time Of Reminder:</Text>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={showDatePicker}
                >
                  <Text style={styles.submitButtonText}>Select Time</Text>
                </TouchableOpacity>
              <Text>Selected Time: {selectedTime ? selectedTime.toLocaleTimeString() : 'None'}</Text>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />

              <View className="flex-row justify-center gap-4">
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitForm}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowPopup(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  arrowButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
    marginTop: 20,
    marginLeft: 40,
  },
  calendarContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
  },
  calendar: {
    borderRadius: 16,
    // backgroundColor: '#39B68D',
  },
  plusContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  plusButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 50,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'stretch',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: 100,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: 100,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  submittedDataContainer: {
    backgroundColor: 'white',
    // marginLeft: 1,
    marginRight: 14,
    paddingTop: 10,
    borderRadius: 8,
  },
  submittedData: {
    paddingLeft: 10,
    marginBottom: 5,
  }
});