
import Channel from './components/Channel'

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

      if (initialising) {
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
      await auth.signOut();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log("Unknown error", error);
      }
    }
  };

  if (initialising) return "Loading...";

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* Navigation bar */}
      <nav className="bg-blue-600 px-8 py-4 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold">
            SimpleChat
          </span>
        </div>

        <div>
          {user && (
            <button
              onClick={signOut}
              className="text-sm font-medium text-white hover:text-red-400 transition"
            >
              Sign out
            </button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {user ? (
          <Channel user={user} db={db}></Channel>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <button
              onClick={signInWithGoogle}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
