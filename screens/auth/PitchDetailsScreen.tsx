"use client"

import { useState, useEffect } from "react"
import { ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { YStack, XStack } from "tamagui"
import { Video } from "expo-av"
import { Image } from "expo-image"
import { ThumbsUp, ThumbsDown, Share2, ArrowLeft } from "lucide-react-native"
import { Text } from "../components/ui"
import { Button } from "../components/ui/Button"
import { Avatar } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import { Card, CardContent } from "../components/ui/Card"
import { LoadingScreen } from "./LoadingScreen"
import { usePitchSubscription } from "../hooks/usePitchSubscription"
import { usePitchViews } from "../hooks/usePitchViews"
import { useVote } from "../hooks/useVote"
import { useAuth } from "../hooks/useAuth"
import { Share } from "react-native"

export default function PitchDetailsScreen({ route, navigation }: any) {
  const { pitchId } = route.params
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const { pitch, loading, error } = usePitchSubscription(pitchId)
  const { views, trackView } = usePitchViews(pitchId)
  const { vote, loading: voting } = useVote(pitchId)
  const [voted, setVoted] = useState<"up" | "down" | null>(null)
  const [upvotes, setUpvotes] = useState(0)
  const [downvotes, setDownvotes] = useState(0)

  useEffect(() => {
    if (pitch) {
      setUpvotes(pitch.upvotes)
      setDownvotes(pitch.downvotes)
    }
  }, [pitch])

  useEffect(() => {
    if (user && pitch) {
      trackView(user.uid)
    }
  }, [user, pitch, trackView])

  async function handleVote(type: "up" | "down") {
    if (voting || !user || !pitch) return

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
        message: `Check out this pitch: ${pitch?.title}`,
        url: `https://yourapp.com/pitch/${pitchId}`,
      })
    } catch (error) {
      console.error("Error sharing pitch:", error)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error || !pitch) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="$red10">{error?.message || "Pitch not found"}</Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <XStack
        paddingTop={insets.top}
        paddingHorizontal="$4"
        paddingBottom="$2"
        backgroundColor="$background"
        alignItems="center"
      >
        <Button variant="ghost" icon={ArrowLeft} onPress={() => navigation.goBack()} size="sm" />
        <Text size="lg" weight="semibold" marginLeft="$2">
          Pitch Details
        </Text>
      </XStack>

      <ScrollView>
        <View style={{ aspectRatio: 16 / 9 }}>
          {pitch.video ? (
            <Video source={{ uri: pitch.video }} useNativeControls resizeMode="contain" style={{ flex: 1 }} />
          ) : pitch.gallery?.[0] ? (
            <Image source={{ uri: pitch.gallery[0] }} style={{ flex: 1 }} contentFit="cover" />
          ) : null}
        </View>

        <YStack padding="$4" gap="$4">
          <XStack alignItems="center" gap="$3">
            <Avatar size="lg" source={{ uri: pitch.creator.avatar }} fallback={pitch.creator.name[0]} />
            <YStack>
              <Text size="lg" weight="bold">
                {pitch.title}
              </Text>
              <Text size="sm" color="muted">
                By {pitch.creator.name}
              </Text>
              <XStack gap="$2" marginTop="$1">
                <Badge>{pitch.category}</Badge>
                <Badge variant="outline">{pitch.type}</Badge>
                <Badge variant="outline">{views} views</Badge>
              </XStack>
            </YStack>
          </XStack>

          <XStack gap="$2">
            <Button
              variant={voted === "up" ? "filled" : "outline"}
              onPress={() => handleVote("up")}
              icon={ThumbsUp}
              loading={voting && voted !== "up"}
            >
              {upvotes}
            </Button>
            <Button
              variant={voted === "down" ? "filled" : "outline"}
              onPress={() => handleVote("down")}
              icon={ThumbsDown}
              loading={voting && voted !== "down"}
            >
              {downvotes}
            </Button>
            <Button variant="outline" onPress={handleShare} icon={Share2} />
          </XStack>

          <Card>
            <CardContent padding="$4">
              <Text size="md" weight="semibold" marginBottom="$2">
                Description
              </Text>
              <Text>{pitch.description}</Text>
            </CardContent>
          </Card>

          {/* Render additional details based on pitch type */}
          {renderPitchTypeDetails(pitch)}
        </YStack>
      </ScrollView>
    </YStack>
  )
}

function renderPitchTypeDetails(pitch: any) {
  switch (pitch.type) {
    case "hiring":
      return (
        <Card>
          <CardContent padding="$4">
            <Text size="md" weight="semibold" marginBottom="$2">
              Job Details
            </Text>
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text>Position:</Text>
                <Text weight="semibold">{pitch.position}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text>Salary Range:</Text>
                <Text weight="semibold">
                  ${pitch.salaryMin?.toLocaleString()} - ${pitch.salaryMax?.toLocaleString()}
                </Text>
              </XStack>
              <Text size="sm" marginTop="$2">
                {pitch.requirements}
              </Text>
            </YStack>
          </CardContent>
        </Card>
      )
    case "fundraising":
      const progress = pitch.currentAmount && pitch.goalAmount ? (pitch.currentAmount / pitch.goalAmount) * 100 : 0
      return (
        <Card>
          <CardContent padding="$4">
            <Text size="md" weight="semibold" marginBottom="$2">
              Fundraising Details
            </Text>
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text>Goal Amount:</Text>
                <Text weight="semibold">${pitch.goalAmount?.toLocaleString()}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text>Current Amount:</Text>
                <Text weight="semibold">
                  ${pitch.currentAmount?.toLocaleString()} ({progress.toFixed(0)}%)
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text>Deadline:</Text>
                <Text weight="semibold">{new Date(pitch.deadline).toLocaleDateString()}</Text>
              </XStack>
              <Text size="sm" marginTop="$2">
                {pitch.rewards}
              </Text>
            </YStack>
          </CardContent>
        </Card>
      )
    case "auction":
      return (
        <Card>
          <CardContent padding="$4">
            <Text size="md" weight="semibold" marginBottom="$2">
              Auction Details
            </Text>
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text>Starting Bid:</Text>
                <Text weight="semibold">${pitch.startingBid?.toLocaleString()}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text>Current Bid:</Text>
                <Text weight="semibold">
                  ${pitch.currentBid?.toLocaleString() || pitch.startingBid?.toLocaleString()}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text>Minimum Increment:</Text>
                <Text weight="semibold">${pitch.minimumBidIncrement?.toLocaleString()}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text>Status:</Text>
                <Badge>{pitch.status}</Badge>
              </XStack>
            </YStack>
          </CardContent>
        </Card>
      )
    default:
      return null
  }
}

