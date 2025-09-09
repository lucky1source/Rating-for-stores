"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, Edit, Trash2, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { dummyStores, dummyUsers } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { StoreImage } from "@/components/ui/store-image"

type SortField = "name" | "email" | "address" | "averageRating"
type SortDirection = "asc" | "desc" | null

export function StoresList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const router = useRouter()
  const { toast } = useToast()

  const filteredAndSortedStores = useMemo(() => {
    const filtered = dummyStores.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })

    if (sortDirection) {
      filtered.sort((a, b) => {
        let aValue = a[sortField]
        let bValue = b[sortField]

        if (typeof aValue === "string") aValue = aValue.toLowerCase()
        if (typeof bValue === "string") bValue = bValue.toLowerCase()

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [searchTerm, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />
    if (sortDirection === "desc") return <ArrowDown className="h-4 w-4" />
    return <ArrowUpDown className="h-4 w-4" />
  }

  const getOwnerName = (ownerId: string) => {
    const owner = dummyUsers.find((u) => u.id === ownerId)
    return owner?.name || "Unknown Owner"
  }

  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 4.5) return "default"
    if (rating >= 3.5) return "secondary"
    if (rating >= 2.5) return "outline"
    return "destructive"
  }

  const handleDeleteStore = (storeId: string) => {
    const storeIndex = dummyStores.findIndex((s) => s.id === storeId)
    if (storeIndex !== -1) {
      const store = dummyStores[storeIndex]
      dummyStores.splice(storeIndex, 1)

      // Update the owner's storeId to undefined
      const ownerIndex = dummyUsers.findIndex((u) => u.id === store.ownerId)
      if (ownerIndex !== -1) {
        dummyUsers[ownerIndex].storeId = undefined
      }

      toast({
        title: "Store deleted",
        description: `${store.name} has been removed from the platform`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-primary">Store Management</h1>
          <p className="text-muted-foreground">View and manage all platform stores</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Stores ({filteredAndSortedStores.length})</CardTitle>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button onClick={() => router.push("/admin/add-store")}>Add New Store</Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Name {getSortIcon("name")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("email")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Email {getSortIcon("email")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("address")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Address {getSortIcon("address")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("averageRating")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Rating {getSortIcon("averageRating")}
                      </Button>
                    </TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <StoreImage src={store.storeImage} alt={store.name} size="sm" />
                      </TableCell>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{store.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRatingBadgeVariant(store.averageRating)}>
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {store.averageRating.toFixed(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">({store.ratings.length})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getOwnerName(store.ownerId)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/stores/${store.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/stores/${store.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStore(store.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredAndSortedStores.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No stores found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
