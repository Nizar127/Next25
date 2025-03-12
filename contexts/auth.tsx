"use client"

import type React from "react"
import { createContext, useEffect, useState } from "react"
import auth, { type FirebaseAuthTypes } from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

interface AuthContextType {
  user: FirebaseAuthTypes.User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address")
      }
      if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password")
      }
      throw new Error("Could not sign in. Please try again.")
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user } = await auth().createUserWithEmailAndPassword(email, password)
      await user.updateProfile({ displayName: name })

      // Create user document in Firestore
      await firestore().collection("users").doc(user.uid).set({
        name,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email already in use")
      }
      if (error.code === "auth/weak-password") {
        throw new Error("Password is too weak")
      }
      throw new Error("Could not create account. Please try again.")
    }
  }

  const signOut = async () => {
    try {
      await auth().signOut()
    } catch (error) {
      throw new Error("Could not sign out. Please try again.")
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email)
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email")
      }
      throw new Error("Could not send reset email. Please try again.")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

