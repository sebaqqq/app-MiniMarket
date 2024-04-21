import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkVflYZa7XfUBFmAJomRvYjVQdb2tW8Jo",
  authDomain: "saga-ed938.firebaseapp.com",
  projectId: "saga-ed938",
  storageBucket: "saga-ed938.appspot.com",
  messagingSenderId: "49283180293",
  appId: "1:49283180293:web:4a2ad3156f8714f590396c",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
