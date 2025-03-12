import { styled } from "tamagui"
import { Sheet as TamaguiSheet } from "tamagui"

export const Sheet = styled(TamaguiSheet, {
  name: "Sheet",
  backgroundColor: "$background",
  borderTopLeftRadius: "$4",
  borderTopRightRadius: "$4",
  padding: "$4",
})

export const SheetHeader = styled(TamaguiSheet.Header, {
  name: "SheetHeader",
  paddingBottom: "$4",
})

export const SheetContent = styled(TamaguiSheet.Content, {
  name: "SheetContent",
  flex: 1,
})

export const SheetFooter = styled(TamaguiSheet.Footer, {
  name: "SheetFooter",
  paddingTop: "$4",
  borderTopWidth: 1,
  borderTopColor: "$gray6",
})

export const SheetTrigger = TamaguiSheet.Trigger
export const SheetClose = TamaguiSheet.Close

