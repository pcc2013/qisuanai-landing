// D:\nira-app\src\adapters\auth.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBlZaLvjY2K3lGA4HDF0lE2AnBbk6hOt9s",
  authDomain: "niraapp-57093.firebaseapp.com",
  projectId: "niraapp-57093",
  storageBucket: "niraapp-57093.appspot.com",
  messagingSenderId: "836407940831",
  appId: "1:836407940831:web:66363fa91ccdf3d07ffb6a",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export async function loginWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

export async function logoutFirebase() {
  return await signOut(auth);
}

export function onAuthChange(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}

export { auth };