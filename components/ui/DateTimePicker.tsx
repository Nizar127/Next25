"use client"

import { useState } from "react"
import { Platform } from "react-native"
import RNNDateTimePicker from "@react-native-community/datetimepicker"
import { Button } from "./Button"
import { Text } from "./Text"
import { styled } from "tamagui"
import { View } from "tamagui"

const Container = styled(View, {
  name: "DateTimePickerContainer",
})

interface DateTimePickerProps {
  value: Date
  onChange: (date: Date) => void
  mode?: "date" | "time" | "datetime"
  minimumDate?: Date
  maximumDate?: Date
  label?: string
}

export function DateTimePicker({
  value,
  onChange,
  mode = "date",
  minimumDate,
  maximumDate,
  label,
}: DateTimePickerProps) {
  const [show, setShow] = useState(false)

  const handleChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value
    if (Platform.OS === "android") {
      setShow(false)
    }
    onChange(currentDate)
  }

  const formatValue = () => {
    if (mode === "date") {
      return value.toLocaleDateString()
    } else if (mode === "time") {
      return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return value.toLocaleString()
    }
  }

  return (
    <Container>
      {label && (
        <Text size="sm" color="$gray11" marginBottom="$1">
          {label}
        </Text>
      )}
      <Button variant="outline" onPress={() => setShow(true)}>
        {formatValue()}
      </Button>
      {show && (
        <RNNDateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </Container>
  )
}

