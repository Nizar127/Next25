"use client"

import { useState } from "react"
import { FlashList } from "@shopify/flash-list"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { YStack, XStack } from "tamagui"
import { Text } from "../components/ui"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Image } from "expo-image"
import { Fire, Sparkles, Clock } from "lucide-react-native"
import { usePitches } from "../hooks/usePitches"

export default function DiscoverScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState("trending")
  const { pitches, loading, refreshing, refresh } = usePitches()

  // Sample categories - in real app, fetch from API
  const categories = [
    { name: "Technology", count: 156 },
    { name: "Business", count: 89 },
    { name: "Social Impact", count: 45 },
    { name: "Creative", count: 78 },
    { name: "Education", count: 34 },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "trending":
      case "new":
        return (
          <FlashList
            data={pitches}
            renderItem={({ item }) => (
              <Card marginBottom="$4">
                <CardContent padding="$4">
                  <YStack>
                    <Image
                      source={{ uri: item.video || "/placeholder.svg" }}
                      style={{ aspectRatio: 16 / 9, borderRadius: 8 }}
                      contentFit="cover"
                    />
                    <Text size="md" weight="semibold" marginTop="$2">
                      {item.title}
                    </Text>
                    <Text size="sm" color="muted" marginTop="$1" numberOfLines={2}>
                      {item.description}
                    </Text>
                    <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => navigation.navigate("PitchDetails", { pitchId: item.id })}
                      >
                        View Pitch
                      </Button>
                    </XStack>
                  </YStack>
                </CardContent>
              </Card>
            )}
            estimatedItemSize={250}
            numColumns={1}
            contentContainerStyle={{ padding: 16 }}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        )
      case "categories":
        return (
          <FlashList
            data={categories}
            renderItem={({ item }) => (
              <Card marginBottom="$4">
                <CardContent padding="$4">
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                      <Text size="md" weight="semibold">
                        {item.name}
                      </Text>
                      <Text size="sm" color="muted">
                        {item.count} pitches
                      </Text>
                    </YStack>
                    <Button variant="outline">Explore</Button>
                  </XStack>
                </CardContent>
              </Card>
            )}
            estimatedItemSize={80}
            numColumns={1}
            contentContainerStyle={{ padding: 16 }}
          />
        )
      default:
        return null
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingTop={insets.top} paddingHorizontal="$4" backgroundColor="$background">
        <Text size="xl" weight="bold" marginVertical="$4">
          Discover
        </Text>
      </YStack>

      <XStack paddingHorizontal="$4">
        <Button
          variant={activeTab === "trending" ? "filled" : "ghost"}
          onPress={() => setActiveTab("trending")}
          flex={1}
          icon={Fire}
        >
          Trending
        </Button>
        <Button
          variant={activeTab === "new" ? "filled" : "ghost"}
          onPress={() => setActiveTab("new")}
          flex={1}
          icon={Sparkles}
        >
          New
        </Button>
        <Button
          variant={activeTab === "categories" ? "filled" : "ghost"}
          onPress={() => setActiveTab("categories")}
          flex={1}
          icon={Clock}
        >
          Categories
        </Button>
      </XStack>

      {renderTabContent()}
    </YStack>
  )
}

