import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBD1owgxCcGiZI9iPM_D6rVtOsc3oOV-3A',
  authDomain: 'poenalista.firebaseapp.com',
  projectId: 'poenalista',
  storageBucket: 'poenalista.appspot.com',
  messagingSenderId: '612605054540',
  appId: '1:612605054540:web:62cd883fd027a830e82ee9',
  measurementId: 'G-C2257HDVWE',
}

export const firebase = initializeApp(firebaseConfig)

const auth = new GoogleAuthProvider()
auth.addScope('profile')
auth.addScope('email')
auth.addScope('https://www.googleapis.com/auth/contacts.readonly')

export const firebaseAuthProvider = auth
