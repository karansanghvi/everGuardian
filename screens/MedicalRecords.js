import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import DocumentPicker from 'react-native-document-picker'; // Import DocumentPicker

const MedicalRecords = () => {
  const [documents, setDocuments] = useState([]);

  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf], // Allow images and PDFs
      });
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('Name : ' + res.name);
      // Add the selected document to the documents array
      setDocuments(prevDocuments => [...prevDocuments, { uri: res.uri, type: res.type, name: res.name }]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error while picking the file', err);
      }
    }
  };

  const handleSubmitButton = () => {
    // Perform submission logic here
    // For demonstration purposes, just logging the documents
    console.log('Submitted Documents:', documents);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Medical Records</Text>
        </View>
      </SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <TouchableOpacity
            style={styles.uploadButton} // Add a new style for upload button
            onPress={handleUpload}
          >
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
          {documents.map((document, index) => (
            <View key={index} style={styles.document}>
              <Text style={styles.documentName}>{document.name}</Text>
              <Text style={styles.documentType}>{document.type}</Text>
              <Text style={styles.documentURI}>{document.uri}</Text>
            </View>
          ))}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitButton}
          >
            <Text style={styles.submitButtonText}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}

export default MedicalRecords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  uploadButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  document: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  documentType: {
    fontSize: 14,
    color: 'gray',
  },
  documentURI: {
    fontSize: 14,
    color: 'blue',
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
