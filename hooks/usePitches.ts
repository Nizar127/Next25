"use client"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore"
import { firestore } from "../firebase"
import { handleFirestoreError } from "../services/firebase"
import type { Pitch } from "../types"

export function usePitches(category?: string) {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPitches = useCallback(async () => {
    try {
      setError(null)

      let q
      if (category) {
        q = query(
          collection(firestore, "pitches"),
          where("category", "==", category),
          orderBy("createdAt", "desc"),
          limit(20),
        )
      } else {
        q = query(collection(firestore, "pitches"), orderBy("createdAt", "desc"), limit(20))
      }

      const snapshot = await getDocs(q)
      const fetchedPitches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pitch[]

      setPitches(fetchedPitches)
    } catch (error) {
      setError(handleFirestoreError(error))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [category])

  const refresh = useCallback(() => {
    setRefreshing(true)
    fetchPitches()
  }, [fetchPitches])

  const createPitch = async (data: Omit<Pitch, "id" | "createdAt" | "updatedAt">) => {
    try {
      const docRef = await addDoc(collection(firestore, "pitches"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      refresh()
      return docRef.id
    } catch (error) {
      throw handleFirestoreError(error)
    }
  }

  const updatePitch = async (id: string, data: Partial<Pitch>) => {
    try {
      const docRef = doc(firestore, "pitches", id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
      refresh()
    } catch (error) {
      throw handleFirestoreError(error)
    }
  }

  const deletePitch = async (id: string) => {
    try {
      const docRef = doc(firestore, "pitches", id)
      await deleteDoc(docRef)
      setPitches((current) => current.filter((pitch) => pitch.id !== id))
    } catch (error) {
      throw handleFirestoreError(error)
    }
  }

  useEffect(() => {
    fetchPitches()
  }, [fetchPitches])

  return {
    pitches,
    loading,
    error,
    refreshing,
    refresh,
    createPitch,
    updatePitch,
    deletePitch,
  }
}

