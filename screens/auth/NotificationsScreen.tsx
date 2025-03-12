"use client"

import { useState } from "react"
import { FlashList } from "@shopify/flash-list"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { YStack, XStack } from "tamagui"
import { Text } from "../components/ui"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Bell, CheckCheck, ThumbsUp, UserPlus, Star, Clock } from "lucide-react-native"

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState("all")

  // In real app, fetch notifications from API
  const notifications = {
    unread: [
      {
        id: 1,
        type: "like",
        content: "John Doe liked your pitch",
        time: "2 minutes ago",
        icon: ThumbsUp,
      },
      {
        id: 2,
        type: "follow",
        content: "Sarah Smith started following you",
        time: "1 hour ago",
        icon: UserPlus,
      },
    ],
    earlier: [
      {
        id: 3,
        type: "feature",
        content: "Your pitch was featured in Technology category",
        time: "2 days ago",
        icon: Star,
      },
      {
        id: 4,
        type: "reminder",
        content: "Reminder: Upcoming pitch deadline in 2 days",
        time: "3 days ago",
        icon: Clock,
      },
    ],
  }

  const allNotifications = [...notifications.unread, ...notifications.earlier]

  const renderNotification = ({ item }: { item: any }) => {
    const Icon = item.icon
    const isUnread = notifications.unread.some((n) => n.id === item.id)

    return (
      <Card marginBottom="$2" position="relative" overflow="hidden">
        {isUnread && <YStack position="absolute" left={0} top={0} bottom={0} width={4} backgroundColor="$primary" />}
        <CardContent padding="$4">
          <XStack gap="$4">
            <YStack
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={isUnread ? "$primary/10" : "$gray5"}
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Icon size={20} color={isUnread ? "$primary" : "$gray11"} />
            </YStack>
            <YStack flex={1}>
              <Text size="sm">{item.content}</Text>
              <Text size="xs" color="muted" marginTop="$1">
                {item.time}
              </Text>
            </YStack>
          </XStack>
        </CardContent>
      </Card>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <FlashList
            data={allNotifications}
            renderItem={renderNotification}
            estimatedItemSize={80}
            ListHeaderComponent={() => (
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$2" paddingHorizontal="$2">
                <Text size="sm" weight="semibold" color="muted">
                  {notifications.unread.length > 0 ? "New" : "Notifications"}
                </Text>
                {notifications.unread.length > 0 && (
                  <Badge variant="secondary" borderRadius={999}>
                    {notifications.unread.length}
                  </Badge>
                )}
              </XStack>
            )}
            contentContainerStyle={{ padding: 16 }}
          />
        )
      case "mentions":
      case "pitches":
        return (
          <YStack flex={1} justifyContent="center" alignItems="center" padding="$12">
            <Bell size={48} color="$gray11" />
            <Text color="muted" marginTop="$4">
              No new {activeTab === "mentions" ? "mentions" : "pitch notifications"}
            </Text>
          </YStack>
        )
      default:
        return null
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingTop={insets.top} paddingHorizontal="$4" backgroundColor="$background">
        <XStack justifyContent="space-between" alignItems="center" marginVertical="$4">
          <Text size="xl" weight="bold">
            Notifications
          </Text>
          <Button variant="outline" size="sm" icon={CheckCheck}>
            Mark all as read
          </Button>
        </XStack>
      </YStack>

      <XStack paddingHorizontal="$4">
        <Button variant={activeTab === "all" ? "filled" : "ghost"} onPress={() => setActiveTab("all")} flex={1}>
          All
        </Button>
        <Button
          variant={activeTab === "mentions" ? "filled" : "ghost"}
          onPress={() => setActiveTab("mentions")}
          flex={1}
        >
          Mentions
        </Button>
        <Button variant={activeTab === "pitches" ? "filled" : "ghost"} onPress={() => setActiveTab("pitches")} flex={1}>
          Pitches
        </Button>
      </XStack>

      {renderContent()}
    </YStack>
  )
}

