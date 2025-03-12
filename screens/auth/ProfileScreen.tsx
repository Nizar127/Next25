"use client"

import { useState } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { YStack, XStack } from "tamagui"
import { Text } from "../components/ui"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Avatar } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import { Settings, Share2, Mail } from "lucide-react-native"
import { useAuth } from "../hooks/useAuth"

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("about")

  // In a real app, fetch user data from API
  const userData = {
    name: user?.displayName || "User",
    username: `@${user?.displayName?.toLowerCase().replace(/\s+/g, "") || "user"}`,
    avatar: user?.photoURL,
    bio: "Tech entrepreneur passionate about sustainability and innovation. Building the future of clean energy.",
    stats: {
      pitches: 12,
      supporters: 156,
      supporting: 23,
    },
    about: {
      summary:
        "Experienced entrepreneur and software engineer with a passion for sustainable technology and innovation.",
      skills: [
        { name: "Entrepreneurship", level: 90 },
        { name: "Product Strategy", level: 85 },
        { name: "Software Development", level: 95 },
      ],
      experience: [
        {
          role: "Founder & CEO",
          company: "EcoTech Solutions",
          period: "2020 - Present",
        },
        {
          role: "CTO",
          company: "Innovation Labs",
          period: "2018 - 2020",
        },
      ],
    },
    pitches: [
      {
        id: 1,
        title: "EcoTrack",
        category: "Technology",
        status: "Active",
        votes: 156,
      },
      {
        id: 2,
        title: "LocalEats",
        category: "Business",
        status: "Completed",
        votes: 89,
      },
    ],
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <YStack gap="$4">
            <Card>
              <CardContent padding="$4">
                <Text size="md" weight="semibold" marginBottom="$2">
                  Professional Summary
                </Text>
                <Text>{userData.about.summary}</Text>
              </CardContent>
            </Card>

            <Card>
              <CardContent padding="$4">
                <Text size="md" weight="semibold" marginBottom="$2">
                  Skills
                </Text>
                <XStack flexWrap="wrap" gap="$2">
                  {userData.about.skills.map((skill) => (
                    <Badge key={skill.name} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </XStack>
              </CardContent>
            </Card>

            <Card>
              <CardContent padding="$4">
                <Text size="md" weight="semibold" marginBottom="$2">
                  Experience
                </Text>
                <YStack gap="$2">
                  {userData.about.experience.map((exp, index) => (
                    <YStack key={index}>
                      <Text weight="semibold">{exp.role}</Text>
                      <Text size="sm" color="muted">
                        {exp.company} • {exp.period}
                      </Text>
                    </YStack>
                  ))}
                </YStack>
              </CardContent>
            </Card>

            <Button onPress={() => signOut()} marginTop="$4">
              Sign Out
            </Button>
          </YStack>
        )
      case "pitches":
        return (
          <YStack gap="$4">
            {userData.pitches.map((pitch) => (
              <Card key={pitch.id}>
                <CardContent padding="$4">
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                      <Text weight="semibold">{pitch.title}</Text>
                      <XStack gap="$2" alignItems="center" marginTop="$1">
                        <Badge variant="secondary">{pitch.category}</Badge>
                        <Text size="sm" color="muted">
                          {pitch.votes} votes
                        </Text>
                      </XStack>
                    </YStack>
                    <Button
                      variant="outline"
                      onPress={() => navigation.navigate("PitchDetails", { pitchId: pitch.id })}
                    >
                      View
                    </Button>
                  </XStack>
                </CardContent>
              </Card>
            ))}
          </YStack>
        )
      case "supported":
        return (
          <YStack justifyContent="center" alignItems="center" padding="$12">
            <Text color="muted">No supported pitches yet</Text>
          </YStack>
        )
      default:
        return null
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView>
        <YStack paddingTop={insets.top} paddingHorizontal="$4">
          <XStack justifyContent="space-between" alignItems="flex-start" marginVertical="$4">
            <XStack gap="$4" alignItems="center">
              <Avatar
                size="xl"
                source={userData.avatar ? { uri: userData.avatar } : undefined}
                fallback={userData.name[0]}
              />
              <YStack>
                <Text size="xl" weight="bold">
                  {userData.name}
                </Text>
                <Text color="muted">{userData.username}</Text>
                <Text size="sm" marginTop="$2">
                  {userData.bio}
                </Text>
              </YStack>
            </XStack>
          </XStack>

          <XStack gap="$2" marginBottom="$4">
            <Button variant="outline" icon={Mail} flex={1}>
              Message
            </Button>
            <Button variant="outline" icon={Share2} size="icon" />
            <Button variant="outline" icon={Settings} size="icon" />
          </XStack>

          <XStack justifyContent="space-between" marginBottom="$4">
            <Card flex={1} marginRight="$2">
              <CardContent padding="$3" alignItems="center">
                <Text size="xl" weight="bold">
                  {userData.stats.pitches}
                </Text>
                <Text size="sm" color="muted">
                  Pitches
                </Text>
              </CardContent>
            </Card>
            <Card flex={1} marginRight="$2">
              <CardContent padding="$3" alignItems="center">
                <Text size="xl" weight="bold">
                  {userData.stats.supporters}
                </Text>
                <Text size="sm" color="muted">
                  Supporters
                </Text>
              </CardContent>
            </Card>
            <Card flex={1}>
              <CardContent padding="$3" alignItems="center">
                <Text size="xl" weight="bold">
                  {userData.stats.supporting}
                </Text>
                <Text size="sm" color="muted">
                  Supporting
                </Text>
              </CardContent>
            </Card>
          </XStack>

          <XStack marginBottom="$4">
            <Button variant={activeTab === "about" ? "filled" : "ghost"} onPress={() => setActiveTab("about")} flex={1}>
              About
            </Button>
            <Button
              variant={activeTab === "pitches" ? "filled" : "ghost"}
              onPress={() => setActiveTab("pitches")}
              flex={1}
            >
              Pitches
            </Button>
            <Button
              variant={activeTab === "supported" ? "filled" : "ghost"}
              onPress={() => setActiveTab("supported")}
              flex={1}
            >
              Supported
            </Button>
          </XStack>

          {renderTabContent()}
        </YStack>
      </ScrollView>
    </YStack>
  )
}

