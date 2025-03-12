import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, Search, PlusCircle, Bell, User } from "lucide-react-native"
import { useTheme } from "tamagui"
import { useAuth } from "../hooks/useAuth"
import { Text } from "../components/ui"

// Screens
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
import HomeScreen from "../screens/HomeScreen"
import DiscoverScreen from "../screens/DiscoverScreen"
import CreatePitchScreen from "../screens/CreatePitchScreen"
import NotificationsScreen from "../screens/NotificationsScreen"
import ProfileScreen from "../screens/ProfileScreen"
import PitchDetailsScreen from "../screens/PitchDetailsScreen"
import LoadingScreen from "../screens/LoadingScreen"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function TabNavigator() {
  const theme = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <Home size={size} color={color} />
            case "Discover":
              return <Search size={size} color={color} />
            case "Create":
              return <PlusCircle size={size} color={color} />
            case "Notifications":
              return <Bell size={size} color={color} />
            case "Profile":
              return <User size={size} color={color} />
          }
        },
        tabBarActiveTintColor: theme.primary.val,
        tabBarInactiveTintColor: theme.gray11.val,
        tabBarLabel: ({ focused, color }) => (
          <Text size="xs" color={focused ? "primary" : "muted"} marginTop={-5}>
            {route.name}
          </Text>
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen
        name="Create"
        component={CreatePitchScreen}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function Navigation() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        // Auth screens
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Group>
      ) : (
        // App screens
        <Stack.Group>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="PitchDetails"
            component={PitchDetailsScreen}
            options={{
              headerShown: true,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="CreatePitch"
            component={CreatePitchScreen}
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}

