"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star, LogOut, User, Store, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { dummyStores, dummyUsers, dummyRatings } from "@/lib/auth"

export function StoreOwnerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Get the store owned by this user
  const ownedStore = dummyStores.find((s) => s.ownerId === user?.id)

  // Get ratings for the owned store
  const storeRatings = ownedStore ? dummyRatings.filter((r) => r.storeId === ownedStore.id) : []

  // Get users who rated the store
  const ratingUsers = storeRatings.map((rating) => {
    const ratingUser = dummyUsers.find((u) => u.id === rating.userId)
    return {
      ...rating,
      userName: ratingUser?.name || "Unknown User",
      userEmail: ratingUser?.email || "Unknown Email",
    }
  })

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!ownedStore) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No store assigned to your account</p>
            <Button onClick={() => router.push("/profile")}>Go to Profile</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Store Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/profile")} className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Store Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{ownedStore.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{storeRatings.length}</div>
              <p className="text-xs text-muted-foreground">Customer reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Status</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-sm">
                Active
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Store is live</p>
            </CardContent>
          </Card>
        </div>

        {/* Store Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {ownedStore.name}
            </CardTitle>
            <CardDescription>Your store information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Email:</strong> {ownedStore.email}
            </p>
            <p>
              <strong>Address:</strong> {ownedStore.address}
            </p>
          </CardContent>
        </Card>

        {/* Customer Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Ratings</CardTitle>
            <CardDescription>
              Users who have submitted ratings for your store ({ratingUsers.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ratingUsers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ratingUsers.map((ratingUser) => (
                      <TableRow key={ratingUser.id}>
                        <TableCell className="font-medium">{ratingUser.userName}</TableCell>
                        <TableCell>{ratingUser.userEmail}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{ratingUser.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(ratingUser.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No ratings submitted yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Customers will be able to rate your store once they discover it
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
