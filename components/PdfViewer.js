import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { PDFView } from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';
import { Constants } from 'expo-constants';

const PDFViewer = ({ uri }) => {
  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    downloadPDF();
  }, []);

  const downloadPDF = async () => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        `${FileSystem.documentDirectory}pdf.pdf`
      );

      const { uri: localUri } = await downloadResumable.downloadAsync();
      setPdfUri(localUri);
      setLoading(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={pdfUri}
        resourceType="file"
      />
    </View>
  );
};

export default PDFViewer;
