import { type GetProps, styled } from "tamagui"
import { Avatar as TamaguiAvatar } from "tamagui"
import { Image } from "expo-image"
// Add the missing Text import at the top
import { Text } from "./Text"

const StyledAvatar = styled(TamaguiAvatar, {
  name: "Avatar",
  borderRadius: 999,
  overflow: "hidden",
  backgroundColor: "$gray5",

  variants: {
    size: {
      xs: {
        width: 24,
        height: 24,
      },
      sm: {
        width: 32,
        height: 32,
      },
      md: {
        width: 40,
        height: 40,
      },
      lg: {
        width: 48,
        height: 48,
      },
      xl: {
        width: 64,
        height: 64,
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
})

const StyledImage = styled(Image, {
  width: "100%",
  height: "100%",
})

const StyledFallback = styled(TamaguiAvatar.Fallback, {
  name: "AvatarFallback",
  width: "100%",
  height: "100%",
  backgroundColor: "$gray5",
  alignItems: "center",
  justifyContent: "center",
})

type AvatarProps = GetProps<typeof StyledAvatar> & {
  source?: { uri: string }
  fallback?: string
}

export function Avatar({ source, fallback, ...props }: AvatarProps) {
  return (
    <StyledAvatar {...props}>
      {source?.uri ? (
        <StyledImage source={source} contentFit="cover" transition={200} />
      ) : (
        <StyledFallback>
          <Text size={props.size === "xs" || props.size === "sm" ? "sm" : "md"} weight="medium" color="$gray11">
            {fallback?.[0].toUpperCase()}
          </Text>
        </StyledFallback>
      )}
    </StyledAvatar>
  )
}

