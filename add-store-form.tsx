"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { validateAddress, validateEmail, dummyStores, dummyUsers } from "@/lib/auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function AddStoreForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const storeOwners = dummyUsers.filter((u) => u.role === "store_owner")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.name.length < 3) {
      newErrors.name = "Store name must be at least 3 characters"
    }

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    const addressError = validateAddress(formData.address)
    if (addressError) newErrors.address = addressError

    if (!formData.ownerId) newErrors.ownerId = "Please select a store owner"

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the form errors before submitting")
    }

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    const loadingToast = toast.loading("Adding new store...")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newStore = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: formData.ownerId,
        ratings: [],
        averageRating: 0,
      }

      dummyStores.push(newStore)

      // Update the store owner's storeId
      const ownerIndex = dummyUsers.findIndex((u) => u.id === formData.ownerId)
      if (ownerIndex !== -1) {
        dummyUsers[ownerIndex].storeId = newStore.id
      }

      toast.dismiss(loadingToast)
      toast.success(`Store "${formData.name}" has been successfully added to the platform!`)

      router.push("/admin/stores")
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to add store. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
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
          <h1 className="text-2xl font-bold text-primary">Add New Store</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Add a new store to the platform with owner assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Enter store name"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  placeholder="Enter store email address"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  placeholder="Enter store address (max 400 characters)"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Store Owner</Label>
                <Select
                  value={formData.ownerId}
                  onValueChange={(value) => handleInputChange("ownerId", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select store owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeOwners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ownerId && <p className="text-sm text-destructive">{errors.ownerId}</p>}
                {storeOwners.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No store owners available. Create a store owner user first.
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || storeOwners.length === 0}
                  className="flex-1 gap-2 transition-all duration-200 hover:scale-105"
                >
                  {isLoading && <LoadingSpinner size="sm" />}
                  {isLoading ? "Adding Store..." : "Add Store"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
