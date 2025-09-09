"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Mail, MapPin, Store, Star, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { dummyStores, dummyUsers, dummyRatings } from "@/lib/auth"

interface StoreDetailsProps {
  storeId: string
}

export function StoreDetails({ storeId }: StoreDetailsProps) {
  const router = useRouter()
  const store = dummyStores.find((s) => s.id === storeId)

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Store not found</p>
            <Button onClick={() => router.push("/admin/stores")} className="mt-4">
              Back to Stores
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get store owner information
  const owner = dummyUsers.find((u) => u.id === store.ownerId)

  // Get ratings for this store
  const storeRatings = dummyRatings.filter((r) => r.storeId === storeId)

  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 4.5) return "default"
    if (rating >= 3.5) return "secondary"
    if (rating >= 2.5) return "outline"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/admin/stores")} className="gap-2 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Stores
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Store Details</h1>
              <p className="text-muted-foreground">View complete store information</p>
            </div>
            <Button onClick={() => router.push(`/admin/stores/${storeId}/edit`)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Store
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Store Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    {store.name}
                  </CardTitle>
                  <Badge variant={getRatingBadgeVariant(store.averageRating)}>
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {store.averageRating.toFixed(1)}
                  </Badge>
                </div>
                <CardDescription>Store ID: {store.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{store.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{store.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            {owner && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Store Owner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{owner.name}</p>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span className="text-sm">{owner.address}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/admin/users/${owner.id}`)}>
                    View Owner Profile
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Store Ratings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Customer Ratings
                </CardTitle>
                <CardDescription>
                  {storeRatings.length} rating{storeRatings.length !== 1 ? "s" : ""} submitted
                </CardDescription>
              </CardHeader>
              <CardContent>
                {storeRatings.length > 0 ? (
                  <div className="space-y-3">
                    {storeRatings.map((rating) => {
                      const customer = dummyUsers.find((u) => u.id === rating.userId)
                      return (
                        <div key={rating.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{customer?.name || "Unknown Customer"}</p>
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
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No ratings submitted yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{store.averageRating.toFixed(1)}</div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{storeRatings.length}</div>
                  <p className="text-sm text-muted-foreground">Total Ratings</p>
                </div>

                {storeRatings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Rating Distribution</p>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = storeRatings.filter((r) => r.rating === star).length
                      const percentage = storeRatings.length > 0 ? (count / storeRatings.length) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-3">{star}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="w-8 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Store Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="w-full justify-center">
                  Active
                </Badge>
              </CardContent>
            </Card>

            {storeRatings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Latest Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{storeRatings[storeRatings.length - 1]?.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(storeRatings[storeRatings.length - 1]?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
