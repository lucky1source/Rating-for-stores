export type UserRole = "admin" | "user" | "store_owner"

export interface User {
  id: string
  name: string
  email: string
  address: string
  role: UserRole
  password?: string
  storeId?: string // For store owners
  profileImage?: string // Added profile image field for user avatars
}

export interface Store {
  id: string
  name: string
  email: string
  address: string
  ownerId: string
  ratings: Rating[]
  averageRating: number
  storeImage?: string // Added store image field for store photos
}

export interface Rating {
  id: string
  userId: string
  storeId: string
  rating: number
  createdAt: string
}

// Dummy data
export const dummyUsers: User[] = [
  {
    id: "1",
    name: "System Administrator",
    email: "admin@platform.com",
    address: "123 Admin Street, City, State",
    role: "admin",
    password: "Admin123!",
    profileImage: "/professional-admin-avatar-with-glasses.jpg", // Updated to use actual generated avatar images
  },
  {
    id: "2",
    name: "John Smith Regular User",
    email: "john@example.com",
    address: "456 User Avenue, City, State",
    role: "user",
    password: "User123!",
    profileImage: "/friendly-young-man-avatar-with-smile.jpg", // Updated to use actual generated avatar images
  },
  {
    id: "3",
    name: "Store Owner Mike Johnson",
    email: "mike@store.com",
    address: "789 Store Boulevard, City, State",
    role: "store_owner",
    password: "Store123!",
    storeId: "1",
    profileImage: "/business-owner-avatar-with-beard.jpg", // Updated to use actual generated avatar images
  },
]

export const dummyStores: Store[] = [
  {
    id: "1",
    name: "Mike's Electronics Store",
    email: "mike@store.com",
    address: "789 Store Boulevard, City, State",
    ownerId: "3",
    ratings: [],
    averageRating: 0,
    storeImage: "/modern-electronics-store-interior-with-gadgets.jpg", // Updated to use actual generated store images
  },
  {
    id: "2",
    name: "Best Buy Electronics",
    email: "contact@bestbuy.com",
    address: "321 Shopping Mall, City, State",
    ownerId: "4",
    ratings: [],
    averageRating: 4.2,
    storeImage: "/large-electronics-retail-store-with-blue-branding.jpg", // Updated to use actual generated store images
  },
]

export const dummyRatings: Rating[] = [
  {
    id: "1",
    userId: "2",
    storeId: "2",
    rating: 4,
    createdAt: "2024-01-15T10:30:00Z",
  },
]

// Validation functions
export const validateName = (name: string): string | null => {
  if (name.length < 20 || name.length > 60) {
    return "Name must be between 20 and 60 characters"
  }
  return null
}

export const validateAddress = (address: string): string | null => {
  if (address.length > 400) {
    return "Address must not exceed 400 characters"
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  if (password.length < 8 || password.length > 16) {
    return "Password must be between 8 and 16 characters"
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter"
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character"
  }
  return null
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address"
  }
  return null
}
