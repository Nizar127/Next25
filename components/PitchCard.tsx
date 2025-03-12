"use client"

import { useState } from "react"
import { View } from "react-native"
import { Video } from "expo-av"
import { Image } from "expo-image"
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react-native"
import { styled } from "tamagui"
import { Card, CardContent, CardHeader, CardFooter } from "./ui/Card"
import { Text } from "./ui/Text"
import { Avatar } from "./ui/Avatar"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { useVote } from "../hooks/useVote"
import { useAuth } from "../hooks/useAuth"
import { Share } from "react-native"
import type { Pitch } from "../types"

const Container = styled(Card, {
  marginBottom: "$4",
})

const MediaContainer = styled(View, {
  aspectRatio: 16 / 9,
  backgroundColor: "$gray3",
  overflow: "hidden",
})

const StyledVideo = styled(Video, {
  flex: 1,
})

const StyledImage = styled(Image, {
  flex: 1,
})

const ActionsContainer = styled(View, {
  flexDirection: "row",
  gap: "$2",
  marginBottom: "$4",
})

interface PitchCardProps {
  pitch: Pitch
  onPress: () => void
}

export function PitchCard({ pitch, onPress }: PitchCardProps) {
  const { user } = useAuth()
  const [voted, setVoted] = useState<"up" | "down" | null>(null)
  const [upvotes, setUpvotes] = useState(pitch.upvotes)
  const [downvotes, setDownvotes] = useState(pitch.downvotes)
  const { vote, loading: voting } = useVote(pitch.id)

  async function handleVote(type: "up" | "down") {
    if (voting || !user) return

    try {
      const newVote = await vote(user.uid, type)

      if (voted === type) {
        // Remove vote
        setVoted(null)
        if (type === "up") setUpvotes((prev) => prev - 1)
        else setDownvotes((prev) => prev - 1)
      } else {
        // Add/change vote
        if (voted) {
          // Remove previous vote
          if (voted === "up") setUpvotes((prev) => prev - 1)
          else setDownvotes((prev) => prev - 1)
        }
        // Add new vote
        setVoted(type)
        if (type === "up") setUpvotes((prev) => prev + 1)
        else setDownvotes((prev) => prev + 1)
      }
    } catch (error) {
      // Revert optimistic updates on error
      setVoted(voted)
      setUpvotes(pitch.upvotes)
      setDownvotes(pitch.downvotes)
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `Check out this pitch: ${pitch.title}`,
        url: `https://yourapp.com/pitch/${pitch.id}`,
      })
    } catch (error) {
      console.error("Error sharing pitch:", error)
    }
  }

  function renderActionButton() {
    switch (pitch.type) {
      case "hiring":
        const hiringPitch = pitch as any
        return (
          <Button onPress={onPress} size="lg" width="100%">
            {`Apply Now • $${hiringPitch.salaryMin?.toLocaleString() || 0} - $${hiringPitch.salaryMax?.toLocaleString() || 0}`}
          </Button>
        )
      case "fundraising":
        const fundraisingPitch = pitch as any
        const progress =
          fundraisingPitch.currentAmount && fundraisingPitch.goalAmount
            ? (fundraisingPitch.currentAmount / fundraisingPitch.goalAmount) * 100
            : 0
        return (
          <Button onPress={onPress} size="lg" width="100%">
            {`Fund Now • ${progress.toFixed(0)}% of $${fundraisingPitch.goalAmount?.toLocaleString() || 0}`}
          </Button>
        )
      case "auction":
        const auctionPitch = pitch as any
        return (
          <Button onPress={onPress} size="lg" width="100%">
            {`Bid Now • Current: $${auctionPitch.currentBid?.toLocaleString() || auctionPitch.startingBid?.toLocaleString() || 0}`}
          </Button>
        )
      default:
        return (
          <Button onPress={onPress} size="lg" width="100%">
            Support Project
          </Button>
        )
    }
  }

  return (
    <Container pressable onPress={onPress}>
      <CardHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Avatar size="md" source={{ uri: pitch.creator.avatar }} fallback={pitch.creator.name[0]} />
          <View>
            <Text size="md" weight="semibold">
              {pitch.creator.name}
            </Text>
            <Badge variant="secondary">{pitch.category}</Badge>
          </View>
        </View>
      </CardHeader>

      <MediaContainer>
        {pitch.video ? (
          <StyledVideo source={{ uri: pitch.video }} useNativeControls resizeMode="contain" shouldPlay={false} />
        ) : pitch.gallery?.[0] ? (
          <StyledImage source={{ uri: pitch.gallery[0] }} contentFit="cover" transition={200} />
        ) : null}
      </MediaContainer>

      <CardContent>
        <Text size="lg" weight="semibold" marginBottom="$2">
          {pitch.title}
        </Text>
        <Text size="sm" color="muted">
          {pitch.description}
        </Text>
      </CardContent>

      <CardFooter>
        <ActionsContainer>
          <Button
            variant={voted === "up" ? "filled" : "outline"}
            onPress={() => handleVote("up")}
            icon={ThumbsUp}
            loading={voting && voted !== "up"}
            size="sm"
          >
            {upvotes}
          </Button>
          <Button
            variant={voted === "down" ? "filled" : "outline"}
            onPress={() => handleVote("down")}
            icon={ThumbsDown}
            loading={voting && voted !== "down"}
            size="sm"
          >
            {downvotes}
          </Button>
          <Button variant="outline" onPress={handleShare} icon={Share2} size="sm" />
        </ActionsContainer>
        {renderActionButton()}
      </CardFooter>
    </Container>
  )
}

