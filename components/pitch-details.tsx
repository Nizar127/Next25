"use client"

import * as React from "react"
import Image from "next/image"
import { format } from "date-fns"
import {
  X,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Send,
  Calendar,
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Award,
  Clock,
  Heart,
  Hammer,
  FileCheck,
  AlertCircle,
  Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface PitchDetailsProps {
  pitch: any
  show: boolean
  onClose: () => void
  voted: "up" | "down" | null
  upvotes: number
  downvotes: number
  onVote: (type: "up" | "down") => void
}

export function PitchDetails({ pitch, show, onClose, voted, upvotes, downvotes, onVote }: PitchDetailsProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0)
  const [newQuestion, setNewQuestion] = React.useState("")
  const qaScrollRef = React.useRef<HTMLDivElement>(null)

  const gallery = pitch.gallery || [
    { type: "video", url: pitch.video },
    { type: "image", url: "/placeholder.svg" },
    { type: "image", url: "/placeholder.svg" },
  ]

  // Sample data for different pitch types
  const pitchTypeData = {
    fundraising: {
      problem: {
        title: "Problem Statement",
        content: "Carbon emissions tracking is complex and inaccessible for individuals and small businesses.",
        icon: Target,
      },
      solution: {
        title: "Our Solution",
        content:
          "EcoTrack provides an AI-powered mobile app that automatically tracks and suggests ways to reduce carbon footprint.",
        icon: Lightbulb,
      },
      businessModel: {
        title: "Business Model",
        content: "Freemium model with premium features for detailed analytics and custom recommendations.",
        revenue: [
          { source: "Premium Subscriptions", percentage: 60 },
          { source: "Enterprise Licenses", percentage: 30 },
          { source: "Data Analytics", percentage: 10 },
        ],
        icon: TrendingUp,
      },
      market: {
        title: "Market Analysis",
        size: "5.2B USD by 2025",
        growth: "CAGR of 24.3%",
        targetSegments: ["Environmentally Conscious Consumers", "Small Businesses", "Corporate ESG Departments"],
        icon: Users,
      },
      financials: {
        title: "Financial Projections",
        currentRaise: "2M USD",
        valuation: "10M USD",
        projections: [
          { year: 2024, revenue: "1M", profit: "0.2M" },
          { year: 2025, revenue: "3M", profit: "0.8M" },
          { year: 2026, revenue: "8M", profit: "2.5M" },
        ],
        icon: DollarSign,
      },
    },
    hiring: {
      role: {
        title: "Role Overview",
        content:
          "Looking for a Senior Frontend Developer to lead our user interface development and mentor junior developers.",
        requirements: ["5+ years React experience", "Strong TypeScript skills", "UI/UX expertise"],
        icon: Briefcase,
      },
      qualifications: {
        title: "Qualifications",
        education: "Bachelor's in Computer Science or related field",
        experience: "5+ years of professional development experience",
        skills: ["React", "TypeScript", "Next.js", "UI/UX Design", "Team Leadership"],
        icon: Award,
      },
      benefits: {
        title: "Benefits & Perks",
        salary: "$120k - $150k",
        perks: ["Remote Work", "Health Insurance", "401k Match", "Learning Budget", "Flexible Hours"],
        icon: Heart,
      },
      culture: {
        title: "Company Culture",
        values: ["Innovation", "Collaboration", "Work-Life Balance", "Continuous Learning"],
        content: "We're a remote-first team focused on building sustainable technology solutions.",
        icon: Users,
      },
    },
    auction: {
      item: {
        title: "Item Details",
        condition: "Excellent",
        authenticity: "Verified",
        history: "Original owner, purchased in 1955",
        icon: Hammer,
      },
      verification: {
        title: "Authentication & Certification",
        verifier: "Vintage Camera Experts Ltd",
        certificate: "Certificate #12345",
        date: "2024-01-15",
        icon: FileCheck,
      },
      bidding: {
        title: "Bidding Information",
        startingBid: "$5,000",
        currentBid: "$7,500",
        minIncrement: "$250",
        deadline: "2024-02-28T23:59:59Z",
        icon: Clock,
      },
      terms: {
        title: "Terms & Conditions",
        shipping: "Insured worldwide shipping",
        payment: "Escrow service required",
        returns: "No returns accepted",
        icon: AlertCircle,
      },
    },
    campaign: {
      overview: {
        title: "Campaign Overview",
        goal: "Plant 1 million trees by 2025",
        impact: "Reduce carbon footprint by 50,000 tons",
        icon: Target,
      },
      impact: {
        title: "Social Impact",
        metrics: [
          { label: "Trees Planted", value: "250,000", target: "1,000,000" },
          { label: "Communities Reached", value: "50", target: "200" },
          { label: "Carbon Offset (tons)", value: "12,500", target: "50,000" },
        ],
        icon: Heart,
      },
      timeline: {
        title: "Project Timeline",
        phases: [
          { name: "Phase 1: Community Engagement", date: "2024-Q1", status: "completed" },
          { name: "Phase 2: Initial Planting", date: "2024-Q2", status: "in-progress" },
          { name: "Phase 3: Expansion", date: "2024-Q3", status: "planned" },
          { name: "Phase 4: Monitoring", date: "2024-Q4", status: "planned" },
        ],
        icon: Clock,
      },
      sustainability: {
        title: "Sustainability Plan",
        content: "Long-term maintenance and community involvement strategy",
        partners: ["Local Communities", "Environmental NGOs", "Corporate Sponsors"],
        icon: Rocket,
      },
    },
  }

  const renderOverviewContent = () => {
    const data = pitchTypeData[pitch.type as keyof typeof pitchTypeData]
    if (!data) return null

    const renderCollapsible = (
      key: string,
      { title, icon: Icon, ...content }: { title: string; icon: any; [key: string]: any },
    ) => (
      <Collapsible key={key} className="w-full border rounded-lg">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold">{title}</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0 space-y-4">
          {key === "businessModel" && (
            <>
              <p className="text-muted-foreground">{content.content}</p>
              <div className="space-y-3">
                <h4 className="font-medium">Revenue Streams</h4>
                {content.revenue.map((stream: any) => (
                  <div key={stream.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{stream.source}</span>
                      <span>{stream.percentage}%</span>
                    </div>
                    <Progress value={stream.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </>
          )}
          {key === "financials" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Raise</p>
                  <p className="text-2xl font-bold">{content.currentRaise}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Valuation</p>
                  <p className="text-2xl font-bold">{content.valuation}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Projections</h4>
                <div className="space-y-3">
                  {content.projections.map((proj: any) => (
                    <div key={proj.year} className="flex items-center justify-between text-sm">
                      <span>{proj.year}</span>
                      <div className="flex gap-4">
                        <span>Revenue: ${proj.revenue}</span>
                        <span>Profit: ${proj.profit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {key === "market" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Market Size</p>
                  <p className="text-xl font-bold">{content.size}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-xl font-bold">{content.growth}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Target Segments</h4>
                <div className="flex flex-wrap gap-2">
                  {content.targetSegments.map((segment: string) => (
                    <Badge key={segment} variant="secondary">
                      {segment}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
          {key === "role" && (
            <>
              <p className="text-muted-foreground">{content.content}</p>
              <div>
                <h4 className="font-medium mb-2">Key Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {content.requirements.map((req: string) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {key === "qualifications" && (
            <>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Education</h4>
                  <p className="text-muted-foreground">{content.education}</p>
                </div>
                <div>
                  <h4 className="font-medium">Experience</h4>
                  <p className="text-muted-foreground">{content.experience}</p>
                </div>
                <div>
                  <h4 className="font-medium">Required Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {content.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {key === "benefits" && (
            <>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Salary Range</h4>
                  <p className="text-xl font-bold">{content.salary}</p>
                </div>
                <div>
                  <h4 className="font-medium">Benefits & Perks</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {content.perks.map((perk: string) => (
                      <div key={perk} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {key === "impact" && (
            <>
              <div className="space-y-4">
                {content.metrics.map((metric: any) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{metric.label}</span>
                      <span>
                        {metric.value} / {metric.target}
                      </span>
                    </div>
                    <Progress
                      value={(Number.parseInt(metric.value) / Number.parseInt(metric.target)) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          {key === "timeline" && (
            <>
              <div className="space-y-4">
                {content.phases.map((phase: any, index: number) => (
                  <div key={phase.name} className="relative flex gap-4 pb-4 last:pb-0">
                    {index !== content.phases.length - 1 && (
                      <div className="absolute left-[0.9375rem] top-7 bottom-0 w-px bg-border" />
                    )}
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full mt-1.5",
                        phase.status === "completed" && "bg-primary",
                        phase.status === "in-progress" && "bg-yellow-500",
                        phase.status === "planned" && "bg-muted",
                      )}
                    />
                    <div>
                      <p className="font-medium">{phase.name}</p>
                      <p className="text-sm text-muted-foreground">{phase.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {![
            "businessModel",
            "financials",
            "market",
            "role",
            "qualifications",
            "benefits",
            "impact",
            "timeline",
          ].includes(key) && <p className="text-muted-foreground">{content.content}</p>}
        </CollapsibleContent>
      </Collapsible>
    )

    return (
      <div className="space-y-2">
        {Object.entries(data).map(([key, content]) => renderCollapsible(key, content as any))}
      </div>
    )
  }

  const timeline = [
    {
      id: 1,
      title: "Project Kickoff",
      date: "2024-03-15",
      type: "Meeting",
      description: "Initial project meeting with stakeholders.",
      image: "/placeholder.svg",
      achievement: "Defined project scope and objectives.",
    },
    {
      id: 2,
      title: "First Prototype",
      date: "2024-04-20",
      type: "Milestone",
      description: "Completed the first functional prototype.",
      image: "/placeholder.svg",
      achievement: "Successfully tested core functionalities.",
    },
    {
      id: 3,
      title: "User Testing",
      date: "2024-05-10",
      type: "Testing",
      description: "Conducted user testing sessions.",
      image: "/placeholder.svg",
      achievement: "Gathered valuable feedback for improvements.",
    },
    {
      id: 4,
      title: "Final Launch",
      date: "2024-06-25",
      type: "Milestone",
      description: "Officially launched the project.",
      image: "/placeholder.svg",
      achievement: "Successfully achieved project goals.",
    },
  ]

  const qa = [
    {
      id: 1,
      question: "What is the pricing model for your product?",
      askedBy: { name: "John Doe", avatar: "/placeholder.svg" },
      date: "2024-03-20",
      answer: "We offer a freemium model with premium features available through a subscription.",
      answeredBy: { name: "Jane Smith", avatar: "/placeholder.svg" },
      answerDate: "2024-03-22",
    },
    {
      id: 2,
      question: "What are the key differentiators of your solution?",
      askedBy: { name: "Peter Jones", avatar: "/placeholder.svg" },
      date: "2024-03-25",
      answer:
        "Our solution is unique due to its AI-powered automation and personalized recommendations, making it more efficient and user-friendly.",
      answeredBy: { name: "Jane Smith", avatar: "/placeholder.svg" },
      answerDate: "2024-03-27",
    },
  ]

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle submitting the question here
    setNewQuestion("")
    qaScrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const events = [
    {
      id: 1,
      title: "Product Launch Webinar",
      date: "2024-04-10T14:00:00Z",
      description: "Join us for a webinar showcasing our new product.",
      location: "Online",
      duration: "1 hour",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Industry Conference",
      date: "2024-05-15T10:00:00Z",
      description: "We'll be attending and exhibiting at this industry conference.",
      location: "San Francisco, CA",
      duration: "3 days",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Investor Pitch Meeting",
      date: "2024-06-20T16:00:00Z",
      description: "Meeting with potential investors to discuss funding.",
      location: "New York, NY",
      duration: "30 minutes",
      status: "past",
    },
  ]

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="relative h-full overflow-hidden flex flex-col">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-50" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>

        <div className="flex-1 overflow-auto">
          <div className="space-y-6">
            {/* Media Gallery */}
            <div className="w-full bg-black">
              <div className="relative aspect-video">
                {gallery[currentMediaIndex].type === "video" ? (
                  <video className="w-full h-full object-contain" src={gallery[currentMediaIndex].url} controls />
                ) : (
                  <Image
                    src={gallery[currentMediaIndex].url || "/placeholder.svg"}
                    alt="Gallery item"
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <div className="container max-w-5xl mx-auto px-4 py-2">
                <ScrollArea>
                  <div className="flex gap-2">
                    {gallery.map((item, index) => (
                      <button
                        key={index}
                        className={cn(
                          "relative flex-shrink-0 w-20 aspect-video rounded-lg overflow-hidden",
                          currentMediaIndex === index && "ring-2 ring-primary",
                        )}
                        onClick={() => setCurrentMediaIndex(index)}
                      >
                        {item.type === "video" ? (
                          <video src={item.url} className="w-full h-full object-cover" />
                        ) : (
                          <Image
                            src={item.url || "/placeholder.svg"}
                            alt={`Gallery thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="container max-w-5xl mx-auto px-4 pt-6">
              {/* Creator Info */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{pitch.creator[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{pitch.title}</h2>
                  <p className="text-muted-foreground">{pitch.creator}</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="qa">Q&A</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="flex items-center gap-2 py-4">
                    <Badge>{pitch.category}</Badge>
                    <Badge variant="outline">Type: {pitch.type}</Badge>
                    {pitch.deadline && <Badge variant="outline">Deadline: {pitch.deadline}</Badge>}
                  </div>

                  <div className="flex gap-4">
                    <Button variant={voted === "up" ? "default" : "outline"} onClick={() => onVote("up")}>
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {upvotes}
                    </Button>
                    <Button variant={voted === "down" ? "default" : "outline"} onClick={() => onVote("down")}>
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      {downvotes}
                    </Button>
                  </div>

                  <p className="text-muted-foreground">{pitch.description}</p>

                  {renderOverviewContent()}
                </TabsContent>

                <TabsContent value="updates" className="space-y-4">
                  <div className="space-y-8">
                    {timeline.map((item, index) => (
                      <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                        {/* Timeline line */}
                        {index !== timeline.length - 1 && (
                          <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />
                        )}

                        {/* Timeline content */}
                        <div className="relative flex-shrink-0">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-4 ring-background">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{item.title}</h3>
                              <Badge variant="outline">{item.type}</Badge>
                            </div>
                            <time className="text-sm text-muted-foreground">
                              {format(new Date(item.date), "MMMM d, yyyy")}
                            </time>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <p className="text-sm">{item.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Achievement</Badge>
                              <span className="text-sm font-medium">{item.achievement}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="qa" className="h-[600px] flex flex-col">
                  <ScrollArea ref={qaScrollRef} className="flex-1">
                    <div className="space-y-6 p-4">
                      {qa.map((item) => (
                        <div key={item.id} className="space-y-4">
                          {/* Question */}
                          <div className="flex gap-4">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={item.askedBy.avatar} />
                              <AvatarFallback>{item.askedBy.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-muted rounded-lg p-3">
                                <p className="font-medium text-sm">{item.askedBy.name}</p>
                                <p>{item.question}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(item.date), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>

                          {/* Answer */}
                          {item.answer && (
                            <div className="flex gap-4 pl-8">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={item.answeredBy?.avatar} />
                                <AvatarFallback>{item.answeredBy?.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-primary/10 rounded-lg p-3">
                                  <p className="font-medium text-sm">{item.answeredBy?.name}</p>
                                  <p>{item.answer}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(item.answerDate!), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <form onSubmit={handleSubmitQuestion} className="p-4 border-t bg-background">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                      />
                      <Button type="submit">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="events" className="space-y-2">
                  <div className="grid gap-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold truncate">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                            <Badge
                              variant={event.status === "upcoming" ? "default" : "secondary"}
                              className="flex-shrink-0"
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{event.location}</span>
                            <span>•</span>
                            <span>{event.duration}</span>
                          </div>
                          {event.status === "upcoming" && (
                            <Button variant="outline" size="sm" className="mt-2">
                              Add to Calendar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Recommendations Section */}
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-xl">You May Also Be Interested In</h3>
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {/* Sample recommended pitches - in real app, fetch from API */}
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Card>
                          <CardContent className="p-4">
                            <div className="aspect-video rounded-lg bg-muted mb-4 relative overflow-hidden">
                              <Image src="/placeholder.svg" alt="Pitch thumbnail" fill className="object-cover" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">Related Pitch {index + 1}</h4>
                                  <p className="text-sm text-muted-foreground">By {pitch.creator}</p>
                                </div>
                                <Badge variant="secondary">Technology</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Another innovative project from the same creator that you might find interesting.
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{120 + index * 10}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

