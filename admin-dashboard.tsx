"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Store, Star, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { dummyUsers, dummyStores, dummyRatings } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"

export function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const totalUsers = dummyUsers.filter((u) => u.role !== "admin").length
  const totalStores = dummyStores.length
  const totalRatings = dummyRatings.length

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Admin Dashboard" description={`Welcome back, ${user?.name}`} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Users", value: totalUsers, icon: Users, description: "Registered platform users" },
          { title: "Total Stores", value: totalStores, icon: Store, description: "Active stores on platform" },
          { title: "Total Ratings", value: totalRatings, icon: Star, description: "Submitted ratings" },
        ].map((stat, index) => (
          <Card
            key={stat.title}
            className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Add New User", href: "/admin/add-user", icon: Plus, variant: "default" as const },
          { label: "Add New Store", href: "/admin/add-store", icon: Plus, variant: "secondary" as const },
          { label: "Manage Users", href: "/admin/users", icon: Users, variant: "outline" as const },
          { label: "Manage Stores", href: "/admin/stores", icon: Store, variant: "outline" as const },
        ].map((action, index) => (
          <Button
            key={action.href}
            onClick={() => router.push(action.href)}
            variant={action.variant}
            className="h-20 flex flex-col gap-2 transition-all duration-200 hover:scale-105 animate-in fade-in-50"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <action.icon className="h-5 w-5" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyUsers
                .filter((u) => u.role !== "admin")
                .slice(0, 3)
                .map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between animate-in fade-in-50 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle>Store Overview</CardTitle>
            <CardDescription>Store performance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyStores.slice(0, 3).map((store, index) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between animate-in fade-in-50 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{store.averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{store.ratings.length} ratings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
