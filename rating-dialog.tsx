"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star } from "lucide-react"
import { dummyStores, dummyRatings } from "@/lib/auth"
import toast from "react-hot-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface RatingDialogProps {
  storeId: string
  userId: string
  onClose: () => void
}

export function RatingDialog({ storeId, userId, onClose }: RatingDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const store = dummyStores.find((s) => s.id === storeId)
  const existingRating = dummyRatings.find((r) => r.storeId === storeId && r.userId === userId)

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating)
    }
  }, [existingRating])

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating between 1 and 5 stars")
      return
    }

    setIsLoading(true)

    const loadingToast = toast.loading(existingRating ? "Updating your rating..." : "Submitting your rating...")

    // Simulate API delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      if (existingRating) {
        // Update existing rating
        existingRating.rating = rating
        existingRating.createdAt = new Date().toISOString()
      } else {
        // Create new rating
        const newRating = {
          id: Date.now().toString(),
          userId,
          storeId,
          rating,
          createdAt: new Date().toISOString(),
        }
        dummyRatings.push(newRating)
      }

      // Update store's average rating
      const storeRatings = dummyRatings.filter((r) => r.storeId === storeId)
      const averageRating = storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length

      const storeIndex = dummyStores.findIndex((s) => s.id === storeId)
      if (storeIndex !== -1) {
        dummyStores[storeIndex].averageRating = averageRating
        dummyStores[storeIndex].ratings = storeRatings
      }

      toast.dismiss(loadingToast)
      toast.success(
        `${existingRating ? "Rating updated!" : "Rating submitted!"} You rated ${store?.name} ${rating} star${rating !== 1 ? "s" : ""}`,
        { duration: 5000 },
      )

      onClose()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to submit rating. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existingRating ? "Update Rating" : "Rate Store"}</DialogTitle>
          <DialogDescription>
            {existingRating ? "Update your rating for" : "How would you rate"} {store?.name}?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
                disabled={isLoading}
              >
                <Star
                  className={`h-8 w-8 transition-all duration-200 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400 scale-110"
                      : "text-muted-foreground hover:text-yellow-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-sm text-muted-foreground animate-in fade-in-50 duration-300">
              You selected {rating} star{rating !== 1 ? "s" : ""}
            </p>
          )}

          <div className="flex space-x-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || rating === 0} className="flex-1 gap-2">
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading ? "Submitting..." : existingRating ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
