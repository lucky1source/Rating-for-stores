"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search, MapPin, Mail, Store } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { dummyStores, dummyRatings } from "@/lib/auth"
import { RatingDialog } from "./rating-dialog"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import toast from "react-hot-toast"

export function UserDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  const filteredStores = useMemo(() => {
    const filtered = dummyStores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (searchTerm.trim() && filtered.length === 0) {
      toast.error(`No stores found matching "${searchTerm}"`)
    } else if (searchTerm.trim() && filtered.length > 0) {
      toast.success(`Found ${filtered.length} store${filtered.length !== 1 ? "s" : ""} matching "${searchTerm}"`)
    }

    return filtered
  }, [searchTerm])

  const getUserRating = (storeId: string) => {
    return dummyRatings.find((r) => r.storeId === storeId && r.userId === user?.id)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.trim()) {
      toast.loading("Searching stores...", { duration: 500 })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Store Directory" description={`Welcome back, ${user?.name}`} />

      {/* Search */}
      <Card className="mb-8 animate-in fade-in-50 duration-300">
        <CardHeader>
          <CardTitle>Find Stores</CardTitle>
          <CardDescription>Search for stores by name or address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by store name or address..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stores Grid */}
      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store, index) => {
            const userRating = getUserRating(store.id)
            return (
              <Card
                key={store.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {store.email}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{store.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <span className="text-sm">{store.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {store.ratings.length} rating{store.ratings.length !== 1 ? "s" : ""}
                    </div>
                    {userRating && (
                      <Badge variant="secondary" className="gap-1 animate-in fade-in-50 duration-300">
                        <Star className="h-3 w-3 fill-current" />
                        Your rating: {userRating.rating}
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => setSelectedStore(store.id)}
                    className="w-full transition-all duration-200 hover:scale-105"
                    variant={userRating ? "outline" : "default"}
                  >
                    {userRating ? "Update Rating" : "Rate Store"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Store className="h-12 w-12" />}
          title={searchTerm ? "No stores found" : "No stores available"}
          description={
            searchTerm
              ? "No stores match your search criteria. Try adjusting your search terms."
              : "There are currently no stores available on the platform."
          }
        />
      )}

      {/* Rating Dialog */}
      {selectedStore && (
        <RatingDialog storeId={selectedStore} userId={user?.id || ""} onClose={() => setSelectedStore(null)} />
      )}
    </div>
  )
}
