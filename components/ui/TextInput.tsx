import { styled } from "tamagui"
import { Input } from "tamagui"

export const TextInput = styled(Input, {
  name: "TextInput",
  backgroundColor: "$background",
  borderWidth: 1,
  borderColor: "$gray7",
  borderRadius: "$4",
  paddingVertical: "$3",
  paddingHorizontal: "$4",
  fontSize: "$3",
  color: "$color",
  outlineWidth: 0,

  variants: {
    size: {
      sm: {
        paddingVertical: "$2",
        paddingHorizontal: "$3",
        fontSize: "$2",
      },
      md: {
        paddingVertical: "$3",
        paddingHorizontal: "$4",
        fontSize: "$3",
      },
      lg: {
        paddingVertical: "$4",
        paddingHorizontal: "$5",
        fontSize: "$4",
      },
    },
    variant: {
      default: {
        backgroundColor: "$background",
      },
      filled: {
        backgroundColor: "$gray3",
        borderWidth: 0,
      },
    },
    error: {
      true: {
        borderColor: "$red10",
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "default",
  },
})

