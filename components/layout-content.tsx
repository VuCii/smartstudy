"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Home, Users, BookOpen, Calendar, MessageSquare, TrendingUp, Lightbulb, LayoutDashboard } from "lucide-react"
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { UserMenu } from "@/components/user-menu"

const sidebarItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Find Groups", href: "/match", icon: Users },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Recommendations", href: "/recommendations", icon: Lightbulb },
]

export function LayoutContent() {
  const { data: session, status } = useSession() || {}

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6" />
          <span className="text-lg font-bold">Smart Study</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link href={item.href} className="flex items-center space-x-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {status === "loading" && <div>Loading...</div>}
        {status === "authenticated" && session?.user && <UserMenu />}
        {status === "unauthenticated" && (
          <Link href="/signin" className="text-sm font-medium hover:underline">
            Sign In
          </Link>
        )}
      </SidebarFooter>
    </>
  )
}

