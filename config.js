import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5NQr8BSajYfSW2kUNQuTsQAu-XbklCJs",
  authDomain: "everguardian-55395.firebaseapp.com",
  projectId: "everguardian-55395",
  storageBucket: "everguardian-55395.appspot.com",
  messagingSenderId: "947200429629",
  appId: "1:947200429629:web:b17721d85005bb80912454",
  measurementId: "G-MLJK21YNHP"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export {
    firebase
};