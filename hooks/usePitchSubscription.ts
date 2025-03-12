"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { firestore } from "../firebase"
import type { Pitch } from "../types"

export function usePitchSubscription(pitchId: string) {
  const [pitch, setPitch] = useState<Pitch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const docRef = doc(firestore, "pitches", pitchId)

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setPitch({ id: docSnap.id, ...docSnap.data() } as Pitch)
        } else {
          setPitch(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error("Error subscribing to pitch:", err)
        setError(err as Error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [pitchId])

  return { pitch, loading, error }
}

