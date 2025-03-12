import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, Clock, Star, ThumbsUp, UserPlus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NotificationsPage() {
  // In real app, fetch notifications from API
  const notifications = {
    unread: [
      {
        id: 1,
        type: "like",
        content: "John Doe liked your pitch",
        time: "2 minutes ago",
        icon: ThumbsUp,
      },
      {
        id: 2,
        type: "follow",
        content: "Sarah Smith started following you",
        time: "1 hour ago",
        icon: UserPlus,
      },
    ],
    earlier: [
      {
        id: 3,
        type: "feature",
        content: "Your pitch was featured in Technology category",
        time: "2 days ago",
        icon: Star,
      },
      {
        id: 4,
        type: "reminder",
        content: "Reminder: Upcoming pitch deadline in 2 days",
        time: "3 days ago",
        icon: Clock,
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container px-4 py-6 mx-auto max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <Button variant="outline" size="sm">
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="mentions" className="flex-1">
                Mentions
              </TabsTrigger>
              <TabsTrigger value="pitches" className="flex-1">
                Pitches
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4">
                  {notifications.unread.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-semibold text-muted-foreground">New</h2>
                        <Badge variant="secondary" className="rounded-full">
                          {notifications.unread.length}
                        </Badge>
                      </div>
                      {notifications.unread.map((notification) => (
                        <Card key={notification.id} className="relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <notification.icon className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">{notification.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-muted-foreground px-2">Earlier</h2>
                    {notifications.earlier.map((notification) => (
                      <Card key={notification.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <notification.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{notification.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="mentions">
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mb-4" />
                <p>No new mentions</p>
              </div>
            </TabsContent>

            <TabsContent value="pitches">
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mb-4" />
                <p>No new pitch notifications</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

