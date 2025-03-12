"use client"

import * as React from "react"
import { PitchCard } from "@/components/pitch-card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const SCROLL_INTERVAL = 50000 // 50 seconds

export function PitchFeed() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [progress, setProgress] = React.useState(0)
  const [direction, setDirection] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const progressInterval = React.useRef<NodeJS.Timeout>()
  const progressStep = 100 / (SCROLL_INTERVAL / 1000) // Progress increment per second

  // Sample pitch data - in real app, this would come from an API
  const pitches = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      description: "Looking for an experienced React developer to join our innovative team.",
      video: "/placeholder.svg",
      category: "Tech",
      type: "hiring" as const,
      upvotes: 156,
      downvotes: 23,
      creator: "TechCorp",
      salary: "$120k - $150k",
    },
    {
      id: 2,
      title: "EcoTrack App Development",
      description: "Help us build a sustainable future with our carbon tracking app.",
      video: "/placeholder.svg",
      category: "Fundraising",
      type: "fundraising" as const,
      upvotes: 89,
      downvotes: 12,
      creator: "GreenTech",
      goalAmount: 50000,
      currentAmount: 25000,
      deadline: "March 15, 2024",
    },
    {
      id: 3,
      title: "Vintage Camera Collection",
      description: "Rare collection of vintage cameras from the 1950s.",
      video: "/placeholder.svg",
      category: "Collectibles",
      type: "auction" as const,
      upvotes: 45,
      downvotes: 5,
      creator: "VintageCollector",
      startingBid: 5000,
      currentBid: 7500,
      deadline: "February 28, 2024",
    },
    {
      id: 4,
      title: "AI Writing Assistant",
      description: "Revolutionary AI tool for content creators and writers.",
      video: "/placeholder.svg",
      category: "Tech",
      type: "normal" as const,
      upvotes: 234,
      downvotes: 18,
      creator: "AILabs",
    },
  ]

  const startProgress = React.useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    setProgress(0)
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current)
          return 100
        }
        return prev + progressStep
      })
    }, 1000)
  }, [progressStep])

  React.useEffect(() => {
    startProgress()
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [startProgress]) //Corrected dependency

  React.useEffect(() => {
    if (progress >= 100 && !isTransitioning) {
      handleNext()
    }
  }, [progress, isTransitioning]) //Added isTransitioning dependency

  const handleVote = (type: "up" | "down") => {
    setDirection(type === "up" ? -1 : 1)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % pitches.length)
      setIsTransitioning(false)
      startProgress()
    }, 500)
  }

  const handleNext = () => {
    setDirection(1)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % pitches.length)
      setIsTransitioning(false)
      startProgress()
    }, 500)
  }

  return (
    <div className="relative h-[800px] overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Pitch counter */}
      <div className="absolute top-4 right-4 z-10">
        <span className="text-sm font-medium bg-background/80 px-2 py-1 rounded-md">
          {currentIndex + 1} / {pitches.length}
        </span>
      </div>

      {/* Current pitch with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{
            opacity: 0,
            y: direction * 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: direction * -20,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="h-full"
        >
          <PitchCard pitch={pitches[currentIndex]} onVote={handleVote} disabled={isTransitioning} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {pitches.map((_, index) => (
          <div
            key={index}
            className={cn("w-2 h-2 rounded-full transition-colors", index === currentIndex ? "bg-primary" : "bg-muted")}
          />
        ))}
      </div>
    </div>
  )
}

