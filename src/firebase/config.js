import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyDAQNAWn2XDu3FGutWpj3zaaHDnEUK7ojc",
  authDomain: "student-connect-back.firebaseapp.com",
  databaseURL: "https://student-connect-back-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "student-connect-back",
  storageBucket: "student-connect-back.firebasestorage.app",
  messagingSenderId: "797153134842",
  appId: "1:797153134842:web:8830b11e535607a6a1e143",
  measurementId: "G-LCTFQK3GGQ"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
