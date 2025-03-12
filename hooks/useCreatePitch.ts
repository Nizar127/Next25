"use client"

import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { firestore } from "../firebase"
import { uploadToS3 } from "../config/aws"
import { useAuth } from "./useAuth"
import type { CreatePitchData } from "../types"

export function useCreatePitch() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createPitch = async (data: CreatePitchData) => {
    if (!user) throw new Error("User not authenticated")

    try {
      setLoading(true)
      setError(null)

      // Upload media to S3
      const videoKey = data.video ? `pitches/${user.uid}/${Date.now()}-video.mp4` : null
      const galleryKeys = data.gallery
        ? await Promise.all(
            data.gallery.map(async (file, index) => {
              const key = `pitches/${user.uid}/${Date.now()}-gallery-${index}.jpg`
              await uploadToS3(file, key)
              return key
            }),
          )
        : []

      if (videoKey) {
        await uploadToS3(data.video!, videoKey)
      }

      // Create pitch document in Firestore
      const pitchData = {
        ...data,
        creatorId: user.uid,
        video: videoKey,
        gallery: galleryKeys,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      }

      const docRef = await addDoc(collection(firestore, "pitches"), pitchData)

      return docRef.id
    } catch (error) {
      console.error("Error creating pitch:", error)
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { createPitch, loading, error }
}

