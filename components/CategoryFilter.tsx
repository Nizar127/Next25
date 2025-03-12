import { ScrollView } from "react-native"
import { styled } from "tamagui"
import { Button } from "./ui/Button"

const categories = [
  { id: "all", label: "All" },
  { id: "tech", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "creative", label: "Creative" },
  { id: "social", label: "Social Impact" },
]

const ScrollContainer = styled(ScrollView, {
  name: "ScrollContainer",
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  paddingBottom: "$2",
})

interface CategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollContainer>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selected === category.id ? "filled" : "outline"}
          size="sm"
          marginRight="$2"
          onPress={() => onSelect(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </ScrollContainer>
  )
}

