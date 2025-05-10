// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure GoogleSignin
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE', // Get this from Firebase console
  offlineAccess: true, // if you want to access Google API on behalf of the user
});

// Create Auth Context
export const AuthContext = createContext({});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Handle auth state changes
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
    setLoading(false);
  };

  // Set up the auth state listener
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Reset error state
  const resetError = () => setError(null);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      resetError();
      setLoading(true);
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken, user: googleUser } = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      // Sign-in with Firebase
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      // Ensure we have user profile data
      if (userCredential.user && !userCredential.user.photoURL && googleUser.photo) {
        // If Firebase didn't get the photo URL, we can update the user profile
        // Note: This doesn't actually update the Firebase user without additional code
        const updatedUser = { ...userCredential.user, photoURL: googleUser.photo };
        console.log('Enhanced user with photo from Google Sign-In:', updatedUser);
        setUser(updatedUser);
      }
      
      return userCredential.user;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
      console.error('Google Sign-In Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      resetError();
      setLoading(true);
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Sign out from Google
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (googleError) {
        console.log('Google Sign Out Error:', googleError);
        // Continue with function even if Google sign out fails
      }
    } catch (err) {
      setError(err.message || 'Failed to sign out');
      console.error('Sign Out Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auth state values and methods to expose
  const authContextValue = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    resetError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};