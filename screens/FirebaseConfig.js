import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnvBjrFcwS_CV6C0D0FMnDKcaMN5JLiuc",
  authDomain: "cameragame-7051b.firebaseapp.com",
  projectId: "cameragame-7051b",
  storageBucket: "cameragame-7051b.appspot.com",
  messagingSenderId: "623750041208",
  appId: "1:623750041208:web:0331580f7f0b6ddebde78d",
  measurementId: "G-9F2QD8L4WS"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}


export { firebase };