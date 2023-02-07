import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider } from 'firebase/auth'
import {
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence,
  initializeFirestore,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebase = initializeApp(firebaseConfig)

const auth = new GoogleAuthProvider()
auth.addScope('profile')
auth.addScope('email')

export const firebaseAuthProvider = auth

const firestore = initializeFirestore(firebase, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})

void enableIndexedDbPersistence(firestore)

export { firestore }
