"use client"

import { useState } from "react"
import { FlashList } from "@shopify/flash-list"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { YStack } from "tamagui"
import { PitchCard } from "../components/PitchCard"
import { CategoryFilter } from "../components/CategoryFilter"
import { Text } from "../components/ui"
import { LoadingScreen } from "./LoadingScreen"
import { usePitches } from "../hooks/usePitches"
import { useUserPresence } from "../hooks/useUserPresence"
import { useAuth } from "../hooks/useAuth"

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { pitches, loading, error, refreshing, refresh } = usePitches(selectedCategory)

  // Track user presence
  useUserPresence(user?.uid)

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="$red10">{error.message}</Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingTop={insets.top} paddingHorizontal="$4" backgroundColor="$background">
        <Text size="xl" weight="bold" marginVertical="$4">
          Discover Pitches
        </Text>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </YStack>

      <FlashList
        data={pitches}
        renderItem={({ item }) => (
          <PitchCard
            pitch={item}
            onPress={() =>
              navigation.navigate("PitchDetails", {
                pitchId: item.id,
              })
            }
          />
        )}
        estimatedItemSize={400}
        contentContainerStyle={{ padding: 16 }}
        refreshing={refreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          <YStack padding="$4" alignItems="center">
            <Text color="$gray11">No pitches found</Text>
          </YStack>
        }
      />
    </YStack>
  )
}

