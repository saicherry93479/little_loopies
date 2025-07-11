import { useState, useEffect } from 'react'
import { ReviewCard } from './ReviewCard'
import { AddReviewForm } from './AddReviewForm'
import { useAuthStore } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { actions } from 'astro:actions'

interface Review {
  id: string
  user: string
  rating: number
  date: string
  title: string
  content: string
  isVerified: boolean
  helpfulCount: number
}

export function ReviewSection({ productId }: { productId?: string }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { toast } = useToast()
  
  useEffect(() => {
    if (productId) {
      fetchReviews()
    }
  }, [productId])
  
  const fetchReviews = async () => {
    if (!productId) return
    
    setIsLoading(true)
    try {
      const response = await actions.getProductReviews({ productId })
      if (response.data.success) {
        setReviews(response.data.reviews.map((review: any) => ({
          id: review.id,
          user: review.userName,
          rating: review.rating,
          date: review.createdAt,
          title: review.title,
          content: review.content,
          isVerified: review.isVerified,
          helpfulCount: review.helpfulCount
        })))
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0

  const handleSubmitReview = async (newReview: any) => {
    if (!productId) return
    
    try {
      const response = await actions.createReview({
        productId,
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content
      })
      
      if (response.data.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!"
        })
        setIsFormOpen(false)
        fetchReviews()
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to submit review",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    }
  }
  
  return (
    <section className="py-12 border-t mt-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-medium mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={`text-xl ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
              <span className="text-lg">({reviews.length})</span>
            </div>
          </div>
          {isAuthenticated ? (
            <Button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-2"
            >
              Write a Review
            </Button>
          ) : (
            <Button asChild>
              <a href={`/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`}>
                Login to Review
              </a>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-2"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid gap-6">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} productId={productId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
          </div>
        )}

        {isFormOpen && (
          <AddReviewForm 
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmitReview}
          />
        )}
      </div>
    </section>
  )
}