"use client"

import { useState } from "react"
import { styled } from "tamagui"
import { View, ScrollView } from "tamagui"
import { Sheet, SheetContent, SheetTrigger } from "./Sheet"
import { Button } from "./Button"
import { Text } from "./Text"
import { ChevronDown } from "lucide-react-native"

const Container = styled(View, {
  name: "SelectContainer",
})

const OptionContainer = styled(View, {
  paddingVertical: "$3",
  paddingHorizontal: "$4",
  borderBottomWidth: 1,
  borderBottomColor: "$gray6",
})

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
}

export function Select({ options, value, onChange, placeholder = "Select an option", label, disabled }: SelectProps) {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (option: SelectOption) => {
    onChange(option.value)
    setOpen(false)
  }

  return (
    <Container>
      {label && (
        <Text size="sm" color="$gray11" marginBottom="$1">
          {label}
        </Text>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" disabled={disabled} justifyContent="space-between" alignItems="center" width="100%">
            <Text color={selectedOption ? "$color" : "$gray11"}>
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
            <ChevronDown size={16} color="$gray11" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <ScrollView>
            {options.map((option) => (
              <OptionContainer
                key={option.value}
                pressable
                onPress={() => handleSelect(option)}
                backgroundColor={option.value === value ? "$gray3" : "transparent"}
              >
                <Text>{option.label}</Text>
              </OptionContainer>
            ))}
          </ScrollView>
        </SheetContent>
      </Sheet>
    </Container>
  )
}

