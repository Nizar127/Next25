import React, { createContext } from 'react';
//import { auth, db, firestore } from '../config/firebase';
import {auth, db, firestore} from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, push, set } from 'firebase/database';
import { StyleSheet } from 'react-native';  

export const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  // Add any Firebase-related functions you want to expose
  const logEvent = async (eventName, data) => {
    try {
      await setDoc(doc(firestore, 'analytics', Date.now().toString()), {
        event: eventName,
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error("Analytics error:", error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ 
      auth,
      db, 
      firestore,
      logEvent
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook for easy access
export const useFirebase = () => {
  return React.useContext(FirebaseContext);
};