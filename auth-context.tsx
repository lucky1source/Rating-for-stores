"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type User, dummyUsers } from "@/lib/auth"
import toast from "react-hot-toast"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (userData: Omit<User, "id" | "role">) => Promise<boolean>
  updatePassword: (newPassword: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email.trim()) {
      toast.error("Email is required")
      return false
    }

    if (!password.trim()) {
      toast.error("Password is required")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return false
    }

    const foundUser = dummyUsers.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      toast.success(`Welcome back, ${foundUser.name}!`)
      return true
    }
    toast.error("Invalid email or password")
    return false
  }

  const logout = () => {
    const userName = user?.name
    setUser(null)
    localStorage.removeItem("currentUser")
    toast.success(`Goodbye, ${userName}!`)
  }

  const signup = async (userData: Omit<User, "id" | "role">): Promise<boolean> => {
    if (!userData.name.trim()) {
      toast.error("Name is required")
      return false
    }

    if (userData.name.length < 2) {
      toast.error("Name must be at least 2 characters long")
      return false
    }

    if (!userData.email.trim()) {
      toast.error("Email is required")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      toast.error("Please enter a valid email address")
      return false
    }

    if (!userData.password.trim()) {
      toast.error("Password is required")
      return false
    }

    if (userData.password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return false
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(userData.password)) {
      toast.error("Password must contain uppercase, lowercase, number, and special character")
      return false
    }

    if (!userData.address.trim()) {
      toast.error("Address is required")
      return false
    }

    if (userData.address.length < 10) {
      toast.error("Address must be at least 10 characters long")
      return false
    }

    if (dummyUsers.some((u) => u.email === userData.email)) {
      toast.error("Email already exists. Please use a different email.")
      return false
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      role: "user",
    }

    dummyUsers.push(newUser)
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
    toast.success(`Account created successfully! Welcome, ${userData.name}!`)
    return true
  }

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) {
      toast.error("User not found")
      return false
    }

    if (!newPassword.trim()) {
      toast.error("New password is required")
      return false
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return false
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
      toast.error("Password must contain uppercase, lowercase, number, and special character")
      return false
    }

    const userIndex = dummyUsers.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      dummyUsers[userIndex].password = newPassword
      toast.success("Password updated successfully!")
      return true
    }

    toast.error("Failed to update password")
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        updatePassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
