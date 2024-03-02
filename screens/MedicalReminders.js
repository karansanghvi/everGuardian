import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Plus from '../components/Plus';

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
      alert("Please select a date");
    }
  };

  const handleSubmitForm = () => {
    console.log('Your Reminder:', reminderData);
    console.log('Your Notes:', notesData);
    setShowPopup(false);
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
              [selectedDate]: { selected: true, selectedColor: '#39B68D' },
            }}
            style={styles.calendar}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
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
});
