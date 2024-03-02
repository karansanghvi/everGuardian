import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Plus= ({ size, color }) => {
  return (
    <View>
      <Icon name="plus" size={size} color={color} />
    </View>
  );
};

export default Plus;
