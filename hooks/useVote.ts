"use client"

import { useState, useCallback } from "react"
import { doc, runTransaction, serverTimestamp, increment } from "firebase/firestore"
import { firestore } from "../firebase"
import { handleFirestoreError } from "../services/firebase"

export function useVote(pitchId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const vote = useCallback(
    async (userId: string, type: "up" | "down") => {
      if (!userId) {
        setError(new Error("User not authenticated"))
        return null
      }

      try {
        setLoading(true)
        setError(null)

        const voteRef = doc(firestore, "votes", `${pitchId}_${userId}`)
        const pitchRef = doc(firestore, "pitches", pitchId)

        await runTransaction(firestore, async (transaction) => {
          const voteDoc = await transaction.get(voteRef)
          const pitchDoc = await transaction.get(pitchRef)

          if (!pitchDoc.exists()) {
            throw new Error("Pitch not found")
          }

          if (voteDoc.exists()) {
            const currentVote = voteDoc.data() as { type: "up" | "down" }
            if (currentVote.type === type) {
              // Remove vote
              transaction.delete(voteRef)
              transaction.update(pitchRef, {
                [`${type}votes`]: increment(-1),
              })
            } else {
              // Change vote
              transaction.update(voteRef, { type })
              transaction.update(pitchRef, {
                [`${currentVote.type}votes`]: increment(-1),
                [`${type}votes`]: increment(1),
              })
            }
          } else {
            // Add new vote
            transaction.set(voteRef, {
              type,
              userId,
              pitchId,
              createdAt: serverTimestamp(),
            })
            transaction.update(pitchRef, {
              [`${type}votes`]: increment(1),
            })
          }
        })

        return type
      } catch (error) {
        const formattedError = handleFirestoreError(error)
        setError(formattedError)
        throw formattedError
      } finally {
        setLoading(false)
      }
    },
    [pitchId],
  )

  return { vote, loading, error }
}

