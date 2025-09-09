"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Mail, MapPin, User, Star, Store } from "lucide-react"
import { useRouter } from "next/navigation"
import { dummyUsers, dummyStores, dummyRatings, type UserRole } from "@/lib/auth"

interface UserDetailsProps {
  userId: string
}

export function UserDetails({ userId }: UserDetailsProps) {
  const router = useRouter()
  const user = dummyUsers.find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">User not found</p>
            <Button onClick={() => router.push("/admin/users")} className="mt-4">
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getRoleBadgeVariant = (role: UserRole) => {
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

  // Get store information if user is a store owner
  const userStore = user.role === "store_owner" && user.storeId ? dummyStores.find((s) => s.id === user.storeId) : null

  // Get ratings submitted by this user
  const userRatings = dummyRatings.filter((r) => r.userId === userId)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/admin/users")} className="gap-2 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">User Details</h1>
              <p className="text-muted-foreground">View complete user information</p>
            </div>
            <Button onClick={() => router.push(`/admin/users/${userId}/edit`)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit User
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main User Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {user.name}
                  </CardTitle>
                  <Badge variant={getRoleBadgeVariant(user.role)}>{user.role.replace("_", " ")}</Badge>
                </div>
                <CardDescription>User ID: {user.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{user.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Store Information for Store Owners */}
            {userStore && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Owned Store
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{userStore.name}</p>
                    <p className="text-sm text-muted-foreground">{userStore.email}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span className="text-sm">{userStore.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{userStore.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({userStore.ratings.length} ratings)</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User's Submitted Ratings */}
            {user.role === "user" && userRatings.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Submitted Ratings
                  </CardTitle>
                  <CardDescription>Ratings submitted by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userRatings.map((rating) => {
                      const store = dummyStores.find((s) => s.id === rating.storeId)
                      return (
                        <div key={rating.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{store?.name || "Unknown Store"}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{rating.rating}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {user.role === "user" ? userRatings.length : userStore?.ratings.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.role === "user" ? "Ratings Given" : "Ratings Received"}
                  </p>
                </div>

                {userStore && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStore.averageRating.toFixed(1)}</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="w-full justify-center">
                  Active
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
