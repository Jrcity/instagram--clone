import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDIRJjuy-U0dy-Xr9k9vgv57ePF63J3tf8',
  authDomain: 'instagram--clone-8ec94.firebaseapp.com',
  projectId: 'instagram--clone-8ec94',
  storageBucket: 'instagram--clone-8ec94.appspot.com',
  messagingSenderId: '899023712430',
  appId: '1:899023712430:web:5c91bcd2c8e77aa320fd3f',
  measurementId: 'G-2Z5DDVS5M7',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, storage };
