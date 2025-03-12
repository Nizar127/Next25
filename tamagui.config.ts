import { createTamagui } from "tamagui"
import { createInterFont } from "@tamagui/font-inter"
import { shorthands } from "@tamagui/shorthands"
import { themes, tokens } from "@tamagui/themes"
import { createMedia } from "@tamagui/react-native-media-driver"

const headingFont = createInterFont({
  size: {
    6: 15,
    7: 18,
    8: 20,
    9: 23,
    10: 28,
    11: 34,
    12: 41,
  },
  transform: {
    6: "uppercase",
    7: "none",
  },
  weight: {
    6: "400",
    7: "600",
  },
  color: {
    6: "$colorFocus",
    7: "$color",
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
  },
  face: {
    700: { normal: "InterBold" },
    600: { normal: "InterSemiBold" },
    400: { normal: "Inter" },
  },
})

const bodyFont = createInterFont(
  {
    face: {
      700: { normal: "InterBold" },
      600: { normal: "InterSemiBold" },
      400: { normal: "Inter" },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  },
)

const config = createTamagui({
  defaultTheme: "light",
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes,
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
})

export type AppConfig = typeof config

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config

