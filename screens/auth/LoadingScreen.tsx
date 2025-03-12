import { ActivityIndicator } from "react-native"
import { YStack } from "tamagui"
import { Text } from "../components/ui"

export default function LoadingScreen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
      <ActivityIndicator size="large" color="$primary" />
      <Text marginTop="$4">Loading...</Text>
    </YStack>
  )
}

export { LoadingScreen }

