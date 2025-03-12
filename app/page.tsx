import { PitchFeed } from "@/components/pitch-feed"
import { CategoryFilter } from "@/components/category-filter"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Discover Pitches</h1>
            <CategoryFilter />
          </div>
          <PitchFeed />
        </div>
      </div>
    </main>
  )
}

