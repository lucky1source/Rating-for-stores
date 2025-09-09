"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, Edit, Trash2, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { dummyUsers, dummyStores, type UserRole } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav"
import { PageHeader } from "@/components/layout/page-header"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Avatar } from "@/components/ui/avatar"

type SortField = "name" | "email" | "address" | "role"
type SortDirection = "asc" | "desc" | null

export function UsersList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = dummyUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter

      return matchesSearch && matchesRole
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
  }, [searchTerm, roleFilter, sortField, sortDirection])

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

  const getStoreRating = (userId: string) => {
    const user = dummyUsers.find((u) => u.id === userId)
    if (user?.role === "store_owner" && user.storeId) {
      const store = dummyStores.find((s) => s.id === user.storeId)
      return store?.averageRating || 0
    }
    return null
  }

  const handleDeleteUser = () => {
    if (!deleteUserId) return

    const userIndex = dummyUsers.findIndex((u) => u.id === deleteUserId)
    if (userIndex !== -1) {
      const user = dummyUsers[userIndex]
      dummyUsers.splice(userIndex, 1)
      toast({
        title: "User deleted",
        description: `${user.name} has been removed from the platform`,
      })
    }
    setDeleteUserId(null)
  }

  const userToDelete = deleteUserId ? dummyUsers.find((u) => u.id === deleteUserId) : null

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={[{ label: "Users" }]} />

      <PageHeader title="User Management" description="View and manage all platform users">
        <Button onClick={() => router.push("/admin/add-user")} className="gap-2">
          <Users className="h-4 w-4" />
          Add New User
        </Button>
      </PageHeader>

      <Card className="animate-in fade-in-50 duration-300">
        <CardHeader>
          <CardTitle>All Users ({filteredAndSortedUsers.length})</CardTitle>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="user">Normal User</SelectItem>
                <SelectItem value="store_owner">Store Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAndSortedUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                      >
                        Name {getSortIcon("name")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("email")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                      >
                        Email {getSortIcon("email")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("address")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                      >
                        Address {getSortIcon("address")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("role")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                      >
                        Role {getSortIcon("role")}
                      </Button>
                    </TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedUsers.map((user, index) => {
                    const storeRating = getStoreRating(user.id)
                    return (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/50 transition-colors animate-in fade-in-50 duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>
                          <Avatar src={user.profileImage} alt={user.name} size="md" />
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="max-w-xs truncate">{user.address}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>{user.role.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          {storeRating !== null ? (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{storeRating.toFixed(1)}</span>
                              <span className="text-muted-foreground">★</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/users/${user.id}`)}
                              className="hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                              className="hover:bg-secondary/10 hover:text-secondary-foreground transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.role !== "admin" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteUserId(user.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="No users found"
              description="No users match your current search criteria. Try adjusting your filters or search terms."
              action={{
                label: "Add New User",
                onClick: () => router.push("/admin/add-user"),
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        variant="destructive"
      />
    </div>
  )
}
