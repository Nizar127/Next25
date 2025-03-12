"use client"

import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
  Share2,
  Bookmark,
  Eye,
  Zap,
  UserPlus,
  AlertTriangle,
  Volume2,
  VolumeX,
  Info,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PitchDetails } from "@/components/pitch-details"
import { motion } from "framer-motion"
import cn from "classnames"
import { UserProfileDialog } from "@/components/user-profile-dialog"

interface PitchCardProps {
  pitch: {
    id: number
    title: string
    description: string
    video: string
    category: string
    type: "normal" | "auction" | "hiring" | "fundraising"
    upvotes: number
    downvotes: number
    creator: string
    salary?: string
    goalAmount?: number
    currentAmount?: number
    startingBid?: number
    currentBid?: number
    deadline?: string
  }
  onVote: (type: "up" | "down") => void
  disabled?: boolean
}

export function PitchCard({ pitch, onVote, disabled }: PitchCardProps) {
  const [voted, setVoted] = React.useState<"up" | "down" | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`pitch-${pitch.id}-vote`) as "up" | "down" | null
    }
    return null
  })
  const [upvotes, setUpvotes] = React.useState(pitch.upvotes)
  const [downvotes, setDownvotes] = React.useState(pitch.downvotes)
  const [isMuted, setIsMuted] = React.useState(true)
  const [showDetails, setShowDetails] = React.useState(false)
  const [isVoting, setIsVoting] = React.useState(false)
  const [showUserProfile, setShowUserProfile] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handleVote = async (type: "up" | "down") => {
    if (disabled || isVoting) return

    setIsVoting(true)
    if (voted === type) {
      setVoted(null)
      localStorage.removeItem(`pitch-${pitch.id}-vote`)
      if (type === "up") setUpvotes((prev) => prev - 1)
      else setDownvotes((prev) => prev - 1)
    } else {
      if (voted) {
        if (voted === "up") setUpvotes((prev) => prev - 1)
        else setDownvotes((prev) => prev - 1)
      }
      setVoted(type)
      localStorage.setItem(`pitch-${pitch.id}-vote`, type)
      if (type === "up") setUpvotes((prev) => prev + 1)
      else setDownvotes((prev) => prev - 1)
    }

    // Trigger the vote animation and navigation
    onVote(type)
    setIsVoting(false)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const renderActionButton = () => {
    switch (pitch.type) {
      case "hiring":
        return (
          <Button className="w-full" variant="default">
            Apply Now • {pitch.salary}
          </Button>
        )
      case "fundraising":
        const progress = pitch.currentAmount ? (pitch.currentAmount / pitch.goalAmount!) * 100 : 0
        return (
          <Button className="w-full" variant="default">
            Fund Now • {progress.toFixed(0)}% of ${pitch.goalAmount?.toLocaleString()}
          </Button>
        )
      case "auction":
        return (
          <Button className="w-full" variant="default">
            Bid Now • Current: ${pitch.currentBid?.toLocaleString()}
          </Button>
        )
      default:
        return (
          <Button className="w-full" variant="default">
            Support Project
          </Button>
        )
    }
  }

  return (
    <>
      <Card className="overflow-hidden h-full">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <div
            className="flex items-center flex-1 gap-2"
            onClick={() => setShowUserProfile(true)}
            style={{ cursor: "pointer" }}
          >
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{pitch.creator[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{pitch.creator}</span>
              <Badge variant="secondary" className="w-fit">
                {pitch.category}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Zap className="w-4 h-4 mr-2" />
                Boost Now
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Impressions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted cursor-pointer group" onClick={toggleDetails}>
            <video
              ref={videoRef}
              className="object-cover w-full h-full"
              poster="/placeholder.svg"
              muted={isMuted}
              loop
              playsInline
              autoPlay
            >
              <source src={pitch.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to view details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 bg-background/80 hover:bg-background/90"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="p-4">
            <h2 className="mb-2 text-xl font-bold">{pitch.title}</h2>
            <p className="text-sm text-muted-foreground">{pitch.description}</p>
            {pitch.deadline && <p className="mt-2 text-sm text-muted-foreground">Deadline: {pitch.deadline}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-6">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant={voted === "up" ? "default" : "outline"}
                  size="lg"
                  className={cn(
                    "relative group h-16 px-6 transition-all hover:scale-105",
                    disabled && "opacity-50 cursor-not-allowed",
                    voted === "up" && "bg-green-500/10 hover:bg-green-500/20 border-green-500",
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!disabled) {
                      // Create floating hearts effect
                      const button = e.currentTarget
                      const rect = button.getBoundingClientRect()
                      const heart = document.createElement("div")
                      heart.innerHTML = "❤️"
                      heart.className = "absolute pointer-events-none text-xl"
                      heart.style.left = `${Math.random() * rect.width}px`
                      heart.style.top = `${rect.height}px`
                      button.appendChild(heart)

                      // Animate and remove
                      const animation = heart.animate(
                        [
                          { transform: "translateY(0)", opacity: 1 },
                          { transform: "translateY(-100px)", opacity: 0 },
                        ],
                        {
                          duration: 1000,
                          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        },
                      )

                      animation.onfinish = () => heart.remove()
                      handleVote("up")
                    }
                  }}
                  disabled={disabled}
                >
                  <div className="relative z-10 flex items-center">
                    <div className="relative">
                      <ThumbsUp
                        className={cn(
                          "w-6 h-6 mr-2 transition-transform duration-200",
                          voted === "up" ? "text-green-500" : "group-hover:scale-110",
                        )}
                      />
                      {voted === "up" && (
                        <motion.div
                          className="absolute inset-0 text-green-500"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          <ThumbsUp className="w-6 h-6 mr-2" />
                        </motion.div>
                      )}
                    </div>
                    <span className={cn("text-lg font-semibold transition-colors", voted === "up" && "text-green-500")}>
                      {upvotes}
                    </span>
                  </div>
                  <div className="absolute inset-0 overflow-hidden rounded-md">
                    {voted === "up" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 animate-shimmer" />
                    )}
                  </div>
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant={voted === "down" ? "default" : "outline"}
                  size="lg"
                  className={cn(
                    "relative group h-16 px-6 transition-all hover:scale-105",
                    disabled && "opacity-50 cursor-not-allowed",
                    voted === "down" && "bg-red-500/10 hover:bg-red-500/20 border-red-500",
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!disabled) {
                      // Create floating X effect
                      const button = e.currentTarget
                      const rect = button.getBoundingClientRect()
                      const x = document.createElement("div")
                      x.innerHTML = "❌"
                      x.className = "absolute pointer-events-none text-xl"
                      x.style.left = `${Math.random() * rect.width}px`
                      x.style.top = `${rect.height}px`
                      button.appendChild(x)

                      // Animate and remove
                      const animation = x.animate(
                        [
                          { transform: "translateY(0)", opacity: 1 },
                          { transform: "translateY(-100px)", opacity: 0 },
                        ],
                        {
                          duration: 1000,
                          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        },
                      )

                      animation.onfinish = () => x.remove()
                      handleVote("down")
                    }
                  }}
                  disabled={disabled}
                >
                  <div className="relative z-10 flex items-center">
                    <div className="relative">
                      <ThumbsDown
                        className={cn(
                          "w-6 h-6 mr-2 transition-transform duration-200",
                          voted === "down" ? "text-red-500" : "group-hover:scale-110",
                        )}
                      />
                      {voted === "down" && (
                        <motion.div
                          className="absolute inset-0 text-red-500"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          <ThumbsDown className="w-6 h-6 mr-2" />
                        </motion.div>
                      )}
                    </div>
                    <span className={cn("text-lg font-semibold transition-colors", voted === "down" && "text-red-500")}>
                      {downvotes}
                    </span>
                  </div>
                  <div className="absolute inset-0 overflow-hidden rounded-md">
                    {voted === "down" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 animate-shimmer" />
                    )}
                  </div>
                </Button>
              </motion.div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16"
              onClick={(e) => {
                e.stopPropagation()
                // Handle share
              }}
            >
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
          {renderActionButton()}
        </CardFooter>
      </Card>

      <PitchDetails
        pitch={pitch}
        show={showDetails}
        onClose={() => setShowDetails(false)}
        voted={voted}
        upvotes={upvotes}
        downvotes={downvotes}
        onVote={handleVote}
      />
      <UserProfileDialog
        open={showUserProfile}
        onOpenChange={setShowUserProfile}
        user={{
          name: pitch.creator,
          username: `@${pitch.creator.toLowerCase().replace(/\s+/g, "")}`,
          avatar: "/placeholder.svg",
          bio: "Tech entrepreneur passionate about innovation",
          about: {
            summary: "Experienced professional with a passion for technology and innovation.",
            skills: [{ name: "Technology" }, { name: "Innovation" }, { name: "Leadership" }],
            experience: [
              {
                role: "Founder & CEO",
                company: "Tech Company",
                period: "2020 - Present",
              },
            ],
          },
          pitches: [pitch],
        }}
      />
    </>
  )
}

