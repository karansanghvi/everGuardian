import React from 'react';
import { View, Text } from 'react-native';
import PDFViewer from '../components/PdfViewer';

const MedicalRecords = () => {

  const pdfUri = 'https://www.dropbox.com/home?preview=Survery+On+Cloud+Robotics+%26+Robot+Operating+System.pdf';

  return (
    <View>
      <PDFViewer uri = {pdfUri} />
    </View>
  );
}

export default MedicalRecord