"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Star } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    toast.loading("Signing you in...", { id: "login" })

    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const success = await login(email, password)
      if (success) {
        toast.dismiss("login")
        router.push("/dashboard")
      } else {
        toast.dismiss("login")
        toast.error("Invalid email or password", { id: "login" })
      }
    } catch (error) {
      toast.dismiss("login")
      toast.error("An unexpected error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in fade-in-50 duration-500">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Star className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">RatePlatform</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2 transition-all duration-200 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal hover:text-primary transition-colors"
                onClick={() => router.push("/signup")}
                disabled={isLoading}
              >
                Sign up here
              </Button>
            </p>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg animate-in fade-in-50 duration-700">
            <p className="text-xs text-muted-foreground mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Admin:</strong> admin@platform.com / Admin123!
              </p>
              <p>
                <strong>User:</strong> john@example.com / User123!
              </p>
              <p>
                <strong>Store Owner:</strong> mike@store.com / Store123!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
