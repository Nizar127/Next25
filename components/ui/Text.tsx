import { styled, Text as TamaguiText } from "tamagui"

export const Text = styled(TamaguiText, {
  name: "Text",
  fontFamily: "$body",
  color: "$color",

  variants: {
    size: {
      xs: { fontSize: "$1" },
      sm: { fontSize: "$2" },
      md: { fontSize: "$3" },
      lg: { fontSize: "$4" },
      xl: { fontSize: "$5" },
    },
    weight: {
      normal: { fontWeight: "400" },
      medium: { fontWeight: "500" },
      semibold: { fontWeight: "600" },
      bold: { fontWeight: "700" },
    },
    color: {
      primary: { color: "$primary" },
      secondary: { color: "$secondary" },
      muted: { color: "$gray11" },
    },
  },

  defaultVariants: {
    size: "md",
    weight: "normal",
  },
})

