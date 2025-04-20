// context/FirebaseContext.js
import React from 'react';
import { db, firestore } from '../config/firebase';

export const FirebaseContext = React.createContext();

export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ db, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};