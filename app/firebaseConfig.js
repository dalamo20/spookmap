import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  authDomain: process.env.NEXTCONFIG_DOMAIN,
  projectId: process.env.NEXTCONFIG_PROJECTID,
  storageBucket: process.env.NEXTCONFIG_STORAGEBUCKET,
  messagingSenderId: process.env.NEXTCONFIG_MESSAGINGSENDERID,
  appId: process.env.NEXTCONFIG_APPID,
  measurementId: process.env.NEXTCONFIG_MEASUREMENTID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };  