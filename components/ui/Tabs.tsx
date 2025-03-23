"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { styled } from "tamagui"
import { View, ScrollView, Pressable } from "tamagui"
import { Text } from "./Text"

// Create context for tabs state
type TabsContextType = {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component")
  }
  return context
}

// Styled components
const TabsContainer = styled(View, {
  name: "Tabs",
  width: "100%",
})

const TabsListContainer = styled(ScrollView, {
  name: "TabsList",
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})

const TabsTriggerContainer = styled(Pressable, {
  name: "TabsTrigger",
  paddingVertical: "$3",
  paddingHorizontal: "$4",
  borderBottomWidth: 2,
  borderBottomColor: "transparent",

  variants: {
    active: {
      true: {
        borderBottomColor: "$primary",
      },
    },
  },
})

const TabsContentContainer = styled(View, {
  name: "TabsContent",
  flex: 1,
  display: "none",

  variants: {
    active: {
      true: {
        display: "flex",
      },
    },
  },
})

// Component interfaces
interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabsListProps {
  children: React.ReactNode
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
}

// Components
export function Tabs({ defaultValue, value, onValueChange, children, ...props }: TabsProps) {
  const [tabValue, setTabValue] = useState(value || defaultValue)

  const handleValueChange = (newValue: string) => {
    setTabValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value: tabValue, onChange: handleValueChange }}>
      <TabsContainer {...props}>{children}</TabsContainer>
    </TabsContext.Provider>
  )
}

export function TabsList({ children }: TabsListProps) {
  return <TabsListContainer contentContainerStyle={{ flexDirection: "row" }}>{children}</TabsListContainer>
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { value: selectedValue, onChange } = useTabs()
  const isActive = selectedValue === value

  return (
    <TabsTriggerContainer active={isActive} onPress={() => onChange(value)}>
      <Text color={isActive ? "$primary" : "$gray11"} weight={isActive ? "semibold" : "normal"}>
        {children}
      </Text>
    </TabsTriggerContainer>
  )
}

export function TabsContent({ value, children }: TabsContentProps) {
  const { value: selectedValue } = useTabs()
  const isActive = selectedValue === value

  return (
    <TabsContentContainer active={isActive}>{children}</TabsContentContainer>
  )
}

