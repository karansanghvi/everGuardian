// EyeOffIcon.js

import React from 'react';
import { View, Text } from 'react-native';

const EyeOffIcon = ({ size, color }) => {
  // Your EyeOffIcon implementation (replace this with your actual icon component)
  return (
    <View style={{ width: size, height: size, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>🚫</Text>
    </View>
  );
};

export default EyeOffIcon;
