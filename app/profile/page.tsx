import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Settings, Share2, Mail } from "lucide-react"

export default function ProfilePage() {
  // In a real app, fetch user data from API
  const user = {
    name: "Alex Chen",
    username: "@alexchen",
    avatar: "/placeholder.svg",
    bio: "Tech entrepreneur passionate about sustainability and innovation. Building the future of clean energy.",
    stats: {
      pitches: 12,
      supporters: 156,
      supporting: 23,
    },
    about: {
      summary:
        "Experienced entrepreneur and software engineer with a passion for sustainable technology and innovation. Leading multiple successful startups and contributing to open-source projects.",
      skills: [
        { name: "Entrepreneurship", level: 90 },
        { name: "Product Strategy", level: 85 },
        { name: "Software Development", level: 95 },
        { name: "Team Leadership", level: 88 },
        { name: "Sustainable Tech", level: 92 },
      ],
      experience: [
        {
          role: "Founder & CEO",
          company: "EcoTech Solutions",
          period: "2020 - Present",
          description: "Leading a team of 20+ in developing sustainable technology solutions.",
        },
        {
          role: "CTO",
          company: "Innovation Labs",
          period: "2018 - 2020",
          description: "Led technical strategy and development of AI-powered platforms.",
        },
        {
          role: "Senior Software Engineer",
          company: "Tech Giants Inc",
          period: "2015 - 2018",
          description: "Developed scalable solutions for enterprise clients.",
        },
      ],
      education: [
        {
          degree: "Master of Science in Computer Science",
          school: "Stanford University",
          year: "2015",
        },
        {
          degree: "Bachelor of Engineering",
          school: "MIT",
          year: "2013",
        },
      ],
      languages: [
        { name: "English", level: "Native" },
        { name: "Mandarin", level: "Fluent" },
        { name: "Spanish", level: "Intermediate" },
      ],
      interests: ["Sustainable Technology", "AI/ML", "Rock Climbing", "Photography"],
      achievements: [
        "Forbes 30 Under 30 - Technology",
        "3 Successful Exits",
        "15+ Patents Filed",
        "Speaker at TechCrunch Disrupt",
      ],
      social: {
        github: "github.com/alexchen",
        linkedin: "linkedin.com/in/alexchen",
        twitter: "twitter.com/alexchen",
      },
    },
    pitches: [
      {
        id: 1,
        title: "EcoTrack",
        category: "Technology",
        status: "Active",
        votes: 156,
      },
      {
        id: 2,
        title: "LocalEats",
        category: "Business",
        status: "Completed",
        votes: 89,
      },
    ],
    supported: [
      {
        id: 3,
        title: "GreenEnergy",
        category: "Technology",
        creator: "@sarah",
        votes: 234,
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container px-4 py-6 mx-auto max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.username}</p>
                <p className="mt-2 text-sm max-w-md">{user.bio}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{user.stats.pitches}</div>
                <p className="text-sm text-muted-foreground">Pitches</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{user.stats.supporters}</div>
                <p className="text-sm text-muted-foreground">Supporters</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{user.stats.supporting}</div>
                <p className="text-sm text-muted-foreground">Supporting</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="w-full">
              <TabsTrigger value="about" className="flex-1">
                About Me
              </TabsTrigger>
              <TabsTrigger value="pitches" className="flex-1">
                My Pitches
              </TabsTrigger>
              <TabsTrigger value="supported" className="flex-1">
                Supported
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <div className="space-y-8">
                {/* Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
                    <p className="text-muted-foreground">{user.about.summary}</p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Skills</h3>
                    <div className="space-y-4">
                      {user.about.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Experience</h3>
                    <div className="space-y-6">
                      {user.about.experience.map((exp, index) => (
                        <div key={index} className="relative pl-6 pb-6 last:pb-0">
                          {index !== user.about.experience.length - 1 && (
                            <div className="absolute left-0 top-2 bottom-0 w-px bg-border" />
                          )}
                          <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-primary" />
                          <div>
                            <h4 className="font-semibold">{exp.role}</h4>
                            <p className="text-sm text-muted-foreground">
                              {exp.company} • {exp.period}
                            </p>
                            <p className="mt-2 text-sm">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Education</h3>
                    <div className="space-y-4">
                      {user.about.education.map((edu, index) => (
                        <div key={index}>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">
                            {edu.school} • {edu.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.about.languages.map((lang) => (
                        <Badge key={lang.name} variant="secondary">
                          {lang.name} - {lang.level}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.about.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {user.about.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pitches" className="mt-6">
              <div className="space-y-4">
                {user.pitches.map((pitch) => (
                  <Card key={pitch.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{pitch.title}</h3>
                          <Badge variant="secondary">{pitch.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{pitch.status}</span>
                          <span>•</span>
                          <span>{pitch.votes} votes</span>
                        </div>
                      </div>
                      <Button variant="outline">View</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="supported" className="mt-6">
              <div className="space-y-4">
                {user.supported.map((pitch) => (
                  <Card key={pitch.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{pitch.title}</h3>
                          <Badge variant="secondary">{pitch.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>by {pitch.creator}</span>
                          <span>•</span>
                          <span>{pitch.votes} votes</span>
                        </div>
                      </div>
                      <Button variant="outline">View</Button>
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

