"use client"

import { useState } from "react"
import { ScrollView, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { YStack, XStack } from "tamagui"
import { ArrowLeft } from "lucide-react-native"
import { Text } from "../components/ui"
import { Button } from "../components/ui/Button"
import { TextInput } from "../components/ui/TextInput"
import { Select } from "../components/ui/Select"
import { useCreatePitch } from "../hooks/useCreatePitch"
import { useAuth } from "../hooks/useAuth"
import type { CreatePitchData } from "../types"

export default function CreatePitchScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const { createPitch, loading, error } = useCreatePitch()
  const [formData, setFormData] = useState<Partial<CreatePitchData>>({
    type: "normal",
    title: "",
    description: "",
    category: "",
  })

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to create a pitch")
      return
    }

    if (!formData.title || !formData.description || !formData.category) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    try {
      const pitchId = await createPitch(formData as CreatePitchData)
      Alert.alert("Success", "Your pitch has been created", [
        {
          text: "View Pitch",
          onPress: () => navigation.navigate("PitchDetails", { pitchId }),
        },
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create pitch")
    }
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
          Create Pitch
        </Text>
      </XStack>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <YStack gap="$4">
          <YStack>
            <Text size="sm" color="$gray11" marginBottom="$1">
              Pitch Type
            </Text>
            <Select
              label="Pitch Type"
              options={[
                { label: "Normal", value: "normal" },
                { label: "Hiring", value: "hiring" },
                { label: "Fundraising", value: "fundraising" },
                { label: "Auction", value: "auction" },
              ]}
              value={formData.type || "normal"}
              onChange={(value) => updateField("type", value)}
            />
          </YStack>

          <YStack>
            <Text size="sm" color="$gray11" marginBottom="$1">
              Title
            </Text>
            <TextInput
              placeholder="Enter pitch title"
              value={formData.title}
              onChangeText={(text) => updateField("title", text)}
            />
          </YStack>

          <YStack>
            <Text size="sm" color="$gray11" marginBottom="$1">
              Description
            </Text>
            <TextInput
              placeholder="Enter pitch description"
              value={formData.description}
              onChangeText={(text) => updateField("description", text)}
              multiline
              numberOfLines={4}
            />
          </YStack>

          <YStack>
            <Text size="sm" color="$gray11" marginBottom="$1">
              Category
            </Text>
            <Select
              options={[
                { label: "Technology", value: "tech" },
                { label: "Business", value: "business" },
                { label: "Creative", value: "creative" },
                { label: "Social Impact", value: "social" },
              ]}
              value={formData.category || ""}
              onChange={(value) => updateField("category", value)}
              placeholder="Select a category"
            />
          </YStack>

          {/* Additional fields based on pitch type */}
          {formData.type === "hiring" && (
            <>
              <YStack>
                <Text size="sm" color="$gray11" marginBottom="$1">
                  Position
                </Text>
                <TextInput
                  placeholder="Enter position title"
                  value={formData.position || ""}
                  onChangeText={(text) => updateField("position", text)}
                />
              </YStack>

              <XStack gap="$2">
                <YStack flex={1}>
                  <Text size="sm" color="$gray11" marginBottom="$1">
                    Min Salary
                  </Text>
                  <TextInput
                    placeholder="Min"
                    value={formData.salaryMin?.toString() || ""}
                    onChangeText={(text) => updateField("salaryMin", Number(text))}
                    keyboardType="numeric"
                  />
                </YStack>
                <YStack flex={1}>
                  <Text size="sm" color="$gray11" marginBottom="$1">
                    Max Salary
                  </Text>
                  <TextInput
                    placeholder="Max"
                    value={formData.salaryMax?.toString() || ""}
                    onChangeText={(text) => updateField("salaryMax", Number(text))}
                    keyboardType="numeric"
                  />
                </YStack>
              </XStack>
            </>
          )}

          {formData.type === "fundraising" && (
            <YStack>
              <Text size="sm" color="$gray11" marginBottom="$1">
                Goal Amount
              </Text>
              <TextInput
                placeholder="Enter goal amount"
                value={formData.goalAmount?.toString() || ""}
                onChangeText={(text) => updateField("goalAmount", Number(text))}
                keyboardType="numeric"
              />
            </YStack>
          )}

          {formData.type === "auction" && (
            <YStack>
              <Text size="sm" color="$gray11" marginBottom="$1">
                Starting Bid
              </Text>
              <TextInput
                placeholder="Enter starting bid"
                value={formData.startingBid?.toString() || ""}
                onChangeText={(text) => updateField("startingBid", Number(text))}
                keyboardType="numeric"
              />
            </YStack>
          )}

          <Button size="lg" onPress={handleSubmit} loading={loading}>
            Create Pitch
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  )
}

