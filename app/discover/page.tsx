import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlameIcon as Fire, Sparkles, Clock } from "lucide-react"

export default function DiscoverPage() {
  // Sample categories - in real app, fetch from API
  const categories = [
    { name: "Technology", count: 156 },
    { name: "Business", count: 89 },
    { name: "Social Impact", count: 45 },
    { name: "Creative", count: 78 },
    { name: "Education", count: 34 },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
          </div>

          <Tabs defaultValue="trending" className="w-full">
            <TabsList>
              <TabsTrigger value="trending">
                <Fire className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="new">
                <Sparkles className="w-4 h-4 mr-2" />
                New
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Clock className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
            </TabsList>
            <TabsContent value="trending" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-4" />
                      <h3 className="font-semibold mb-2">Amazing Pitch Title</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Brief description of the pitch in exactly 25 words, giving viewers a quick overview of what the
                        idea is about.
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">Technology</Badge>
                        <Button variant="outline" size="sm">
                          View Pitch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="new" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{/* Similar grid of new pitches */}</div>
            </TabsContent>
            <TabsContent value="categories" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card key={category.name}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.count} pitches</p>
                      </div>
                      <Button variant="outline">Explore</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

