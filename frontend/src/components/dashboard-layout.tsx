"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Users, LogOut, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  useEffect(() => {
    setIsMounted(true)

  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!isMounted) return null

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <VisuallyHidden>
              <SheetTitle>Task management</SheetTitle>
            </VisuallyHidden>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-4">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
                <span className="ml-2 text-lg font-semibold">Task Manager</span>
              </div>
              <nav className="grid gap-2 p-4">
                <Button variant="ghost" className="justify-start gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendar
                </Button>
                {user.role === "Manager" && (
                  <Button variant="ghost" className="justify-start gap-2" onClick={()=>{
                    router.push("/dashboard/team")
                    setIsMobileMenuOpen(true)
                  }}   >
                    <Users className="h-5 w-5" />
                    Team Members
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <span className="text-lg font-semibold hidden md:inline-block">Task Manager</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-block text-sm text-muted-foreground">{user.role}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <nav className="grid gap-2 p-4">
            <Button variant="ghost" className="justify-start gap-2">
              <Calendar className="h-5 w-5" />
              Calendar
            </Button>
            {user.role === "Manager" && (
              <Button variant="ghost" className="justify-start gap-2" onClick={()=>{
                router.push("/dashboard/team")
                setIsMobileMenuOpen(false)
              }}>
                <Users className="h-5 w-5" />
                Team Members
              </Button>
            )}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

