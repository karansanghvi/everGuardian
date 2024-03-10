import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';

const EditReminderScreen = ({ route }) => {
    const { dismissAlarmFunction, alarmSound } = route.params;
  
    const handleDismissAlarm = () => {
      // Call the dismissAlarmFunction and pass the alarmSound
      if (dismissAlarmFunction) {
        dismissAlarmFunction(alarmSound);
      }
    };
  
    return (
      <View className="mt-20 ml-10">
        {/* Your Edit Reminder Screen UI */}
        <Text>Edit Reminder Screen</Text>
        <TouchableOpacity onPress={handleDismissAlarm}>
          <Text>Dismiss Alarm</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

export default EditReminderScreen;
