import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ThumbsDown, ThumbsUp, Share2 } from "lucide-react"

export default function PitchPage({ params }: { params: { id: string } }) {
  // In real app, fetch pitch details using params.id
  const pitch = {
    id: params.id,
    title: "EcoTrack: Smart Sustainability",
    description: "Mobile app tracking personal carbon footprint with AI recommendations for eco-friendly choices.",
    longDescription: `A comprehensive mobile application that helps individuals and businesses track and reduce their carbon footprint. Using AI and machine learning, EcoTrack provides personalized recommendations for sustainable choices in daily life.

Key Features:
- Real-time carbon footprint tracking
- AI-powered recommendations
- Community challenges and rewards
- Integration with smart home devices
- Business sustainability analytics`,
    video: "/placeholder.svg",
    category: "Technology",
    upvotes: 156,
    downvotes: 23,
    creator: {
      name: "Alex Chen",
      avatar: "/placeholder.svg",
      bio: "Tech entrepreneur passionate about sustainability",
    },
    updates: [
      {
        date: "2024-02-10",
        title: "Beta Testing Started",
        content: "We've begun beta testing with 100 users...",
      },
      {
        date: "2024-01-25",
        title: "Prototype Complete",
        content: "Successfully completed the initial prototype...",
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted">
                  <video className="w-full h-full object-cover" poster="/placeholder.svg" controls>
                    <source src={pitch.video} type="video/mp4" />
                  </video>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">{pitch.title}</h1>
                    <Badge variant="secondary" className="text-sm">
                      {pitch.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-6">{pitch.description}</p>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {pitch.upvotes}
                    </Button>
                    <Button variant="outline">
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      {pitch.downvotes}
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">About the Project</h2>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{pitch.longDescription}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Project Updates</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pitch.updates.map((update) => (
                    <div key={update.date} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{update.title}</h3>
                        <span className="text-sm text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Creator</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={pitch.creator.avatar} />
                    <AvatarFallback>{pitch.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{pitch.creator.name}</h3>
                    <p className="text-sm text-muted-foreground">{pitch.creator.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Support this Project</h2>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Contact Creator</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

