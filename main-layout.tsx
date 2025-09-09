"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Store, Star, User, LogOut, Home, Plus, BarChart3 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useState } from "react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  if (!user) {
    return <>{children}</>
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
    setShowLogoutDialog(false)
  }

  const getNavigationItems = () => {
    switch (user.role) {
      case "admin":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard" },
          { icon: Users, label: "Users", href: "/admin/users" },
          { icon: Store, label: "Stores", href: "/admin/stores" },
          { icon: Plus, label: "Add User", href: "/admin/add-user" },
          { icon: Plus, label: "Add Store", href: "/admin/add-store" },
        ]
      case "user":
        return [
          { icon: Home, label: "Stores", href: "/dashboard" },
          { icon: User, label: "Profile", href: "/profile" },
        ]
      case "store_owner":
        return [
          { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
          { icon: User, label: "Profile", href: "/profile" },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "store_owner":
        return "secondary"
      case "user":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => router.push("/dashboard")}
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <Star className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-primary">RatePlatform</h1>
              </div>

              {/* Role Badge */}
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs animate-in fade-in-50 duration-300">
                {user.role.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                onClick={() => setShowLogoutDialog(true)}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-card min-h-[calc(100vh-73px)] sticky top-[73px] hidden md:block">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200 hover:translate-x-1",
                    isActive && "bg-primary text-primary-foreground shadow-sm",
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t z-40">
          <nav className="flex justify-around p-2">
            {navigationItems.slice(0, 4).map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex-col gap-1 h-auto py-2 px-3 transition-all duration-200",
                    isActive && "bg-primary text-primary-foreground shadow-sm scale-105",
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:pb-0 pb-20 animate-in fade-in-50 duration-300">{children}</main>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        variant="destructive"
      />
    </div>
  )
}
