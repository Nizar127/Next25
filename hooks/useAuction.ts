"use client"

import { useState, useEffect } from "react"
import { ref, onValue, runTransaction } from "firebase/database"
import { getDatabase } from "firebase/database"
import type { AuctionPitch } from "../types"

export function useAuction(auctionId: string) {
  const [auction, setAuction] = useState<AuctionPitch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const database = getDatabase()

  useEffect(() => {
    const auctionRef = ref(database, `active-auctions/${auctionId}`)

    const unsubscribe = onValue(
      auctionRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setAuction(snapshot.val() as AuctionPitch)
        } else {
          setAuction(null)
        }
        setLoading(false)
      },
      (err) => {
        setError(err as Error)
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [auctionId, database])

  const placeBid = async (amount: number, userId: string) => {
    try {
      const bidRef = ref(database, `active-auctions/${auctionId}`)

      await runTransaction(bidRef, (current) => {
        if (!current) return null
        if (current.currentBid && current.currentBid >= amount) return current

        return {
          ...current,
          currentBid: amount,
          currentBidderId: userId,
          lastBidTime: Date.now(),
        }
      })
    } catch (error) {
      setError(new Error("Failed to place bid"))
      throw error
    }
  }

  return {
    auction,
    loading,
    error,
    placeBid,
  }
}

