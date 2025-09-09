"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, MapPin, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { validatePassword, dummyRatings, dummyStores } from "@/lib/auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function UserProfile() {
  const { user, updatePassword } = useAuth()
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const userRatings = dummyRatings.filter((r) => r.userId === user?.id)

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newPassword.trim()) {
      toast.error("New password is required")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      setError("Passwords do not match")
      return
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      toast.error(passwordError)
      setError(passwordError)
      return
    }

    setIsLoading(true)

    const loadingToast = toast.loading("Updating your password...")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const success = await updatePassword(newPassword)
      if (success) {
        toast.dismiss(loadingToast)
        setNewPassword("")
        setConfirmPassword("")
        setError("")
      } else {
        toast.dismiss(loadingToast)
        toast.error("Failed to update password")
        setError("Failed to update password")
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("An unexpected error occurred while updating password")
      setError("An error occurred while updating password")
    } finally {
      setIsLoading(false)
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
          <h1 className="text-2xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-in fade-in-50 duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{user?.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Password Update */}
            <Card className="animate-in fade-in-50 duration-500">
              <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="8-16 chars, 1 uppercase, 1 special char"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="gap-2 transition-all duration-200 hover:scale-105"
                  >
                    {isLoading && <LoadingSpinner size="sm" />}
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Rating Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userRatings.length}</div>
                  <p className="text-sm text-muted-foreground">Ratings Given</p>
                </div>
                {userRatings.length > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {(userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length).toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Ratings */}
            {userRatings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userRatings.slice(-3).map((rating) => {
                      const store = dummyStores.find((s) => s.id === rating.storeId)
                      return (
                        <div key={rating.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{store?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{rating.rating}</span>
                          </div>
                        </div>
                      )
                    })}
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
