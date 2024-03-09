import React from 'react';
import { Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const MyDateTimePicker = (props) => {
  return (
    <DateTimePickerModal
      {...props}
      headerTextIOS="Pick a Time"
      isDarkModeEnabled={false}
      mode="time"
      locale="en_US"
    />
  );
};

export default MyDateTimePicker;
