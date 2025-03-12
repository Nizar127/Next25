import { styled } from "tamagui"
import { Spinner as TamaguiSpinner } from "tamagui"

export const Spinner = styled(TamaguiSpinner, {
  name: "Spinner",
  color: "$primary",

  variants: {
    size: {
      sm: {
        width: 16,
        height: 16,
      },
      md: {
        width: 24,
        height: 24,
      },
      lg: {
        width: 32,
        height: 32,
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
})

