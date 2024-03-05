// EyeIcon.js
import React from 'react';
import { Svg, Path } from 'react-native-svg';

const EyeIcon = ({ size, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M12 17C9.24282 17 7 14.7572 7 12C7 9.24282 9.24282 7 12 7C14.7572 7 17 9.24282 17 12C17 14.7572 14.7572 17 12 17Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2 12H4M20 12H22M10 12H14M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default EyeIcon;
