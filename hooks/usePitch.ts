"use client"

import { useState, useEffect, useCallback } from "react"
import { doc, getDoc } from "firebase/firestore"
import { firestore } from "../firebase"
import { getSignedS3Url } from "../config/aws"
import type { Pitch, PitchWithUrls } from "../types"

export function usePitch(pitchId: string) {
  const [pitch, setPitch] = useState<PitchWithUrls | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPitch = useCallback(async () => {
    try {
      setError(null)
      const docRef = doc(firestore, "pitches", pitchId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error("Pitch not found")
      }

      const pitchData = { id: docSnap.id, ...docSnap.data() } as Pitch

      // Get signed URLs for media
      const videoUrl = pitchData.video ? await getSignedS3Url(pitchData.video) : null
      const galleryUrls = pitchData.gallery
        ? await Promise.all(pitchData.gallery.map((key) => getSignedS3Url(key)))
        : []

      setPitch({
        ...pitchData,
        videoUrl,
        galleryUrls,
      })
    } catch (error) {
      console.error("Error fetching pitch:", error)
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [pitchId])

  useEffect(() => {
    fetchPitch()
  }, [fetchPitch])

  return { pitch, loading, error, refetch: fetchPitch }
}

