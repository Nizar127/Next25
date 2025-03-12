import {
  collection,
  query,
  where,
  orderBy,
  limit,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore"
import { ref, onValue, set, onDisconnect, increment, runTransaction as rtdbTransaction } from "firebase/database"
import { firestore } from "../firebase"
import { getDatabase } from "firebase/database"
import type { Pitch, Vote } from "../types"

// Initialize Realtime Database
const database = getDatabase()

// Firestore Collections
export const collections = {
  pitches: collection(firestore, "pitches"),
  users: collection(firestore, "users"),
  votes: collection(firestore, "votes"),
  comments: collection(firestore, "comments"),
} as const

// Realtime Database References
export const rtdb = {
  pitchViews: ref(database, "pitch-views"),
  onlineUsers: ref(database, "online-users"),
  activeAuctions: ref(database, "active-auctions"),
} as const

// Firestore Queries
export const queries = {
  // Pitch queries
  recentPitches: (limitCount = 20) => query(collections.pitches, orderBy("createdAt", "desc"), limit(limitCount)),

  pitchesByCategory: (category: string, limitCount = 20) =>
    query(collections.pitches, where("category", "==", category), orderBy("createdAt", "desc"), limit(limitCount)),

  userPitches: (userId: string) =>
    query(collections.pitches, where("creatorId", "==", userId), orderBy("createdAt", "desc")),

  // Vote queries
  userVotes: (userId: string) => query(collections.votes, where("userId", "==", userId)),

  pitchVotes: (pitchId: string) => query(collections.votes, where("pitchId", "==", pitchId)),
} as const

// Firestore Operations
export const firestoreOps = {
  // Create operations with proper typing
  createPitch: async (data: Omit<Pitch, "id" | "createdAt" | "updatedAt">) => {
    const docRef = await addDoc(collections.pitches, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  updatePitch: async (id: string, data: Partial<Pitch>) => {
    const docRef = doc(firestore, "pitches", id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  deletePitch: async (id: string) => {
    // Use a batch to delete the pitch and all related data
    await runTransaction(firestore, async (transaction) => {
      // Delete the pitch
      const pitchRef = doc(firestore, "pitches", id)
      transaction.delete(pitchRef)

      // Delete related votes
      const votesSnapshot = await getDocs(query(collections.votes, where("pitchId", "==", id)))
      votesSnapshot.forEach((voteDoc) => {
        transaction.delete(doc(firestore, "votes", voteDoc.id))
      })

      // Delete related comments
      const commentsSnapshot = await getDocs(query(collections.comments, where("pitchId", "==", id)))
      commentsSnapshot.forEach((commentDoc) => {
        transaction.delete(doc(firestore, "comments", commentDoc.id))
      })
    })
  },

  // Vote operations with optimistic updates
  vote: async (pitchId: string, userId: string, type: "up" | "down"): Promise<void> => {
    const voteRef = doc(firestore, "votes", `${pitchId}_${userId}`)
    const pitchRef = doc(firestore, "pitches", pitchId)

    await runTransaction(firestore, async (transaction) => {
      const voteDoc = await transaction.get(voteRef)
      const pitchDoc = await transaction.get(pitchRef)

      if (!pitchDoc.exists()) {
        throw new Error("Pitch not found")
      }

      if (voteDoc.exists()) {
        const currentVote = voteDoc.data() as Vote
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
  },
} as const

// Realtime Database Operations
export const realtimeOps = {
  // Track pitch views in realtime
  trackPitchView: async (pitchId: string, userId: string) => {
    const viewsRef = ref(database, `pitch-views/${pitchId}`)

    // Increment total views
    const totalViewsRef = ref(database, `pitch-views/${pitchId}/total`)
    await rtdbTransaction(totalViewsRef, (current) => (current || 0) + 1)

    // Track unique viewers
    if (userId) {
      await set(ref(database, `pitch-views/${pitchId}/viewers/${userId}`), Date.now())
    }
  },

  // Track user online status
  trackUserOnline: (userId: string) => {
    const userStatusRef = ref(database, `online-users/${userId}`)

    // Create a reference to the user's online status
    const connectedRef = ref(database, ".info/connected")

    const onValueCallback = onValue(connectedRef, (snapshot) => {
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
      onValueCallback()
      // Set the user as offline
      set(userStatusRef, Date.now())
    }
  },

  // Handle real-time auction updates
  handleAuction: (auctionId: string) => {
    const auctionRef = ref(database, `active-auctions/${auctionId}`)

    const placeBid = async (amount: number, userId: string) => {
      const bidRef = ref(database, `active-auctions/${auctionId}`)

      await rtdbTransaction(bidRef, (current) => {
        if (!current) return null
        if (current.currentBid && current.currentBid >= amount) return current

        return {
          ...current,
          currentBid: amount,
          currentBidderId: userId,
          lastBidTime: Date.now(),
        }
      })
    }

    const subscribeToUpdates = (callback: (data: any) => void) => {
      const unsubscribe = onValue(auctionRef, (snapshot) => {
        callback(snapshot.val())
      })

      return unsubscribe
    }

    return {
      placeBid,
      subscribeToUpdates,
    }
  },
} as const

// Utility function to handle Firestore errors
export function handleFirestoreError(error: any): Error {
  console.error("Firestore Error:", error)

  if (error.code === "permission-denied") {
    return new Error("You do not have permission to perform this action")
  }

  if (error.code === "not-found") {
    return new Error("The requested document was not found")
  }

  if (error.code === "already-exists") {
    return new Error("The document already exists")
  }

  return new Error("An unexpected error occurred")
}

