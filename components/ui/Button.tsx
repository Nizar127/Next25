import type React from "react"
import { type GetProps, styled } from "tamagui"
import { Button as TamaguiButton } from "tamagui"
import type { LucideIcon } from "lucide-react-native"
import { Spinner } from "./Spinner"
import { Text } from "./Text"

export const StyledButton = styled(TamaguiButton, {
  name: "Button",
  backgroundColor: "$background",
  borderRadius: "$4",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  pressStyle: {
    opacity: 0.8,
    scale: 0.98,
  },
  animation: "quick",

  variants: {
    size: {
      sm: {
        padding: "$2",
        gap: "$1",
      },
      md: {
        padding: "$3",
        gap: "$2",
      },
      lg: {
        padding: "$4",
        gap: "$2",
      },
    },
    variant: {
      filled: {
        backgroundColor: "$primary",
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$primary",
      },
      ghost: {
        backgroundColor: "transparent",
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "filled",
  },
})

type ButtonProps = GetProps<typeof StyledButton> & {
  icon?: LucideIcon
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  icon: Icon,
  loading,
  children,
  variant = "filled",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton {...props} variant={variant} size={size} disabled={loading || disabled}>
      {loading ? (
        <Spinner size={size === "sm" ? "sm" : "md"} />
      ) : (
        <>
          {Icon && (
            <Icon
              size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
              color={variant === "filled" ? "$background" : "$primary"}
            />
          )}
          <Text
            size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
            color={variant === "filled" ? "background" : "primary"}
            weight="medium"
          >
            {children}
          </Text>
        </>
      )}
    </StyledButton>
  )
}

