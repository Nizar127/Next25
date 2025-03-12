import { BottomNav } from "@/components/bottom-nav"
import type React from "react"
import "@/styles/globals.css"

export const metadata = {
  title: "Universal Pitch Platform",
  description: "A platform for sharing and discovering pitches",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
        <BottomNav />
      </body>
    </html>
  )
}

