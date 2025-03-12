import { styled } from "tamagui"
import { Card as TamaguiCard } from "tamagui"

export const Card = styled(TamaguiCard, {
  name: "Card",
  backgroundColor: "$background",
  borderRadius: "$4",
  padding: "$4",
  elevation: 3,

  variants: {
    variant: {
      elevated: {
        shadowColor: "$shadowColor",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      outline: {
        borderWidth: 1,
        borderColor: "$gray6",
      },
      ghost: {
        backgroundColor: "transparent",
        padding: 0,
      },
    },
  },

  defaultVariants: {
    variant: "elevated",
  },
})

export const CardHeader = styled(TamaguiCard.Header, {
  name: "CardHeader",
  paddingBottom: "$4",
})

export const CardFooter = styled(TamaguiCard.Footer, {
  name: "CardFooter",
  paddingTop: "$4",
  borderTopWidth: 1,
  borderTopColor: "$gray6",
})

export const CardContent = styled(TamaguiCard.Content, {
  name: "CardContent",
})

