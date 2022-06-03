import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyD6t-guNlLwyqKzbOBj8SjIpek3yX9d7cQ",
    authDomain: "login-994bc.firebaseapp.com",
    projectId: "login-994bc",
    storageBucket: "login-994bc.appspot.com",
    messagingSenderId: "942810809023",
    appId: "1:942810809023:web:10a0c9a6d8fc81cbb5fc0a"
  };
  
  // Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = app.auth()

export {db,auth}