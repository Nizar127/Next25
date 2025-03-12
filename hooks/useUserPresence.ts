"use client"

import { useEffect } from "react"
import { ref, onValue, set, onDisconnect } from "firebase/database"
import { getDatabase } from "firebase/database"

export function useUserPresence(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return

    const database = getDatabase()
    const userStatusRef = ref(database, `online-users/${userId}`)
    const connectedRef = ref(database, ".info/connected")

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        return
      }

      // When user disconnects, update the last online timestamp
      onDisconnect(userStatusRef)
        .set(Date.now())
        .then(() => {
          // Set the user as online
          set(userStatusRef, true)
        })
    })

    return () => {
      // Clean up the listener
      unsubscribe()
      // Set the user as offline
      set(userStatusRef, Date.now())
    }
  }, [userId])
}

