import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
 
const firebaseConfig = {
  apiKey: "AIzaSyAPCCaGq6jbbKbTv37NdVl-NpxyjQS11Tg",
  authDomain: "everguardiann-7afa9.firebaseapp.com",
  projectId: "everguardiann-7afa9",
  storageBucket: "everguardiann-7afa9.appspot.com",
  messagingSenderId: "704548573956",
  appId: "1:704548573956:web:5a46d754fcc5c87466f651"
};
let app;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
} else  { 
    app = firebase.app()
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const { serverTimestamp } = firebase.firestore; 

export {
    firebase,
    auth,
    firestore,
    serverTimestamp,
};