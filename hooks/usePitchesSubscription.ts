"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { firestore } from "../firebase"
import type { Pitch } from "../types"

export function usePitchesSubscription(category?: string) {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
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

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newPitches = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pitch[]
        setPitches(newPitches)
        setLoading(false)
      },
      (err) => {
        console.error("Error subscribing to pitches:", err)
        setError(err as Error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [category])

  return { pitches, loading, error }
}

