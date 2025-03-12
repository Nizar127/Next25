"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusCircle, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CreatePitchSheet } from "@/components/create-pitch-sheet"

export function BottomNav() {
  const pathname = usePathname()
  const [createOpen, setCreateOpen] = React.useState(false)

  const routes = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/discover",
      icon: Search,
      label: "Discover",
    },
    {
      href: "#",
      icon: PlusCircle,
      label: "Create",
      action: () => setCreateOpen(true),
    },
    {
      href: "/notifications",
      icon: Bell,
      label: "Notifications",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
    },
  ]

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <nav className="flex items-center justify-around p-2">
          {routes.map((route) => {
            const Icon = route.icon
            return route.action ? (
              <Button
                key={route.label}
                variant="ghost"
                size="icon"
                className="flex flex-col items-center justify-center gap-1 h-auto py-2"
                onClick={route.action}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{route.label}</span>
              </Button>
            ) : (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors",
                  pathname === route.href && "text-foreground",
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{route.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <CreatePitchSheet open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}

