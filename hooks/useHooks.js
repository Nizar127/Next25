import { useState, useEffect, useContext } from 'react';
import { 
  signInWithGoogle, 
  webSignInWithGoogle,
  signOutUser, 
  getCurrentUser,
  onAuthStateChangedListener 
} from '../services/auth';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setAuthState } = useContext(AuthContext);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            token
          });
          setAuthState({ user: firebaseUser, isAuthenticated: true });
        } else {
          setUser(null);
          setAuthState({ user: null, isAuthenticated: false });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setAuthState]);

  const signInWithGoogleHandler = async () => {
    setLoading(true);
    try {
      // Platform-specific Google sign-in
      const user = Platform.OS === 'web' 
        ? await webSignInWithGoogle()
        : await signInWithGoogle();
      return user;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOutHandler = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setUser(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle: signInWithGoogleHandler,
    signOut: signOutHandler,
    getCurrentUser,
  };
};