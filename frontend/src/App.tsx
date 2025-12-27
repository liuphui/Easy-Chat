import Button from './components/Button'

import { useState, useEffect } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      if (initialising){
        setInitialising(false);
      }
    });

    return unsubscribe;
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await signOut();
    } catch (error) {
      if (error instanceof Error){
        console.log(error.message)
      } else {
        console.log("Unknown error", error);
      }
    }
  };

  if(initialising) return "Loading...";

  return (
    <div>
      {user ? (
        "Welcome to the chat"
      ) : (
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      )}
    </div>
  );
}

export default App
