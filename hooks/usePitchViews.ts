"use client"

import { useState, useEffect } from "react"
import { ref, onValue, runTransaction, set } from "firebase/database"
import { getDatabase } from "firebase/database"

export function usePitchViews(pitchId: string) {
  const [views, setViews] = useState<number>(0)
  const [uniqueViewers, setUniqueViewers] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const database = getDatabase()

  useEffect(() => {
    const viewsRef = ref(database, `pitch-views/${pitchId}`)

    const unsubscribe = onValue(viewsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setViews(data.total || 0)
        setUniqueViewers(Object.keys(data.viewers || {}).length)
      }
      setLoading(false)
    })

    return () => {
      // Clean up the listener
      unsubscribe()
    }
  }, [pitchId, database])

  const trackView = async (userId: string) => {
    const totalViewsRef = ref(database, `pitch-views/${pitchId}/total`)

    // Increment total views
    await runTransaction(totalViewsRef, (current) => (current || 0) + 1)

    // Track unique viewers
    if (userId) {
      await set(ref(database, `pitch-views/${pitchId}/viewers/${userId}`), Date.now())
    }
  }

  return {
    views,
    uniqueViewers,
    loading,
    trackView,
  }
}

