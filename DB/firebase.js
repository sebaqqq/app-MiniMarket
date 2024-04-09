import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkVflYZa7XfUBFmAJomRvYjVQdb2tW8Jo",
  authDomain: "saga-ed938.firebaseapp.com",
  projectId: "saga-ed938",
  storageBucket: "saga-ed938.appspot.com",
  messagingSenderId: "49283180293",
  appId: "1:49283180293:web:4a2ad3156f8714f590396c"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
