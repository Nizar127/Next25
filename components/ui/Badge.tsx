import { styled } from "tamagui"
import { Text } from "./Text"

export const Badge = styled(Text, {
  name: "Badge",
  backgroundColor: "$gray3",
  paddingVertical: "$1",
  paddingHorizontal: "$2",
  borderRadius: "$2",
  fontSize: "$1",
  fontWeight: "500",
  color: "$gray11",

  variants: {
    variant: {
      default: {
        backgroundColor: "$gray3",
        color: "$gray11",
      },
      primary: {
        backgroundColor: "$primary",
        color: "$background",
      },
      secondary: {
        backgroundColor: "$secondary",
        color: "$background",
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$gray7",
      },
    },
  },

  defaultVariants: {
    variant: "default",
  },
})

