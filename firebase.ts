import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocFromServer
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase SDK
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Export Firestore and Storage functions for use in context
export { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getDocFromServer,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
};

// Test connection
async function testConnection() {
  try {
    const docRef = doc(db, 'test', 'connection');
    await getDocFromServer(docRef);
  } catch (error) {
    console.error("Firestore connection test failed:", error);
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();
