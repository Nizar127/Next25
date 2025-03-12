"use client"

import "expo-dev-client"
import { useEffect } from "react"
import { LogBox } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { TamaguiProvider, Theme } from "tamagui"
import { useFonts } from "expo-font"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as SplashScreen from "expo-splash-screen"
import config from "./tamagui.config"
import { AuthProvider } from "./contexts/auth"
import Navigation from "./navigation"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Ignore specific LogBox warnings
LogBox.ignoreLogs([
  'Warning: The provided value "memoizedState" is invalid',
  "Non-serializable values were found in the navigation state",
])

export default function App() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    InterSemiBold: require("@tamagui/font-inter/otf/Inter-SemiBold.otf"),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={config}>
          <Theme name="light">
            <NavigationContainer>
              <AuthProvider>
                <Navigation />
                <StatusBar style="auto" />
              </AuthProvider>
            </NavigationContainer>
          </Theme>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

