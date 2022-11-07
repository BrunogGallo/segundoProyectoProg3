
import app from 'firebase/app';
import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr0rPg_h_m-TgQHo-DrIViVXBUilLjFTs",
  authDomain: "proyecto-final-dd4cb.firebaseapp.com",
  projectId: "proyecto-final-dd4cb",
  storageBucket: "proyecto-final-dd4cb.appspot.com",
  messagingSenderId: "12803336907",
  appId: "1:12803336907:web:63aefa1557416d49fe094e"
};

// Initialize Firebase
app.initializeApp(firebaseConfig);

export const auth = firebase.auth(); //Esta linea la agregamos nosotros
export const storage = app.storage() //
export const db = app.firestore()
