import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { actions } from 'astro:actions'
import { useToast } from '@/hooks/use-toast'
import { ThumbsUp } from 'lucide-react'

interface ReviewCardProps {
  review: {
    user: string
    rating: number
    date: string
    title: string
    content: string
    isVerified: boolean
    helpfulCount: number
    id: string | number
  }
  productId?: string
}

export function ReviewCard({ review, productId }: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { toast } = useToast()
  
  useEffect(() => {
    if (isAuthenticated && productId) {
      checkIfHelpful()
    }
  }, [isAuthenticated, productId])
  
  const checkIfHelpful = async () => {
    try {
      const response = await actions.checkReviewHelpful({ 
        reviewId: review.id.toString() 
      })
      
      if (response.data.success) {
        setIsHelpful(response.data.isHelpful)
      }
    } catch (error) {
      console.error('Error checking helpful status:', error)
    }
  }
  
  const handleHelpfulClick = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to mark reviews as helpful",
      })
      return
    }
    
    setIsLoading(true)
    try {
      const response = await actions.markReviewHelpful({ 
        reviewId: review.id.toString() 
      })
      
      if (response.data.success) {
        const newIsHelpful = response.data.action === 'added'
        setIsHelpful(newIsHelpful)
        setHelpfulCount(prev => newIsHelpful ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium mb-1">{review.title}</h3>
          <div className="flex gap-2 items-center text-sm text-gray-600">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span>•</span>
            <span>{review.user}</span>
            {review.isVerified && (
              <>
                <span>•</span>
                <span className="text-green-600">Verified Purchase</span>
              </>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.date).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{review.content}</p>

      <button 
        className={`text-sm ${isHelpful ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900 flex items-center gap-2`}
        onClick={handleHelpfulClick}
        disabled={isLoading}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>Helpful ({helpfulCount})</span>
      </button>
    </div>
  )
}