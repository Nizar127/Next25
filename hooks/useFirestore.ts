"use client"

import { useCallback } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { firestore } from "../firebase"

export function useFirestore<T>(collectionName: string) {
  const add = useCallback(
    async (data: Partial<T>) => {
      try {
        const docRef = await addDoc(collection(firestore, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        return docRef.id
      } catch (error) {
        console.error(`Error adding document to ${collectionName}:`, error)
        throw error
      }
    },
    [collectionName],
  )

  const update = useCallback(
    async (id: string, data: Partial<T>) => {
      try {
        const docRef = doc(firestore, collectionName, id)
        await updateDoc(docRef, {
          ...data,
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        console.error(`Error updating document in ${collectionName}:`, error)
        throw error
      }
    },
    [collectionName],
  )

  const remove = useCallback(
    async (id: string) => {
      try {
        const docRef = doc(firestore, collectionName, id)
        await deleteDoc(docRef)
      } catch (error) {
        console.error(`Error deleting document from ${collectionName}:`, error)
        throw error
      }
    },
    [collectionName],
  )

  const get = useCallback(
    async (id: string) => {
      try {
        const docRef = doc(firestore, collectionName, id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as T & { id: string }
        } else {
          throw new Error(`Document with ID ${id} not found`)
        }
      } catch (error) {
        console.error(`Error getting document from ${collectionName}:`, error)
        throw error
      }
    },
    [collectionName],
  )

  return { add, update, remove, get }
}

