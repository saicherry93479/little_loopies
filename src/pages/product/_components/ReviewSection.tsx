import { useState } from 'react'
import { ReviewCard } from './ReviewCard'
import { AddReviewForm } from './AddReviewForm'

interface Review {
  id: number
  user: string
  rating: number
  date: string
  title: string
  content: string
  isVerified: boolean
  helpfulCount: number
}

const dummyReviews: Review[] = [
  {
    id: 1,
    user: "Sarah M.",
    rating: 5,
    date: "2024-02-15",
    title: "Perfect for my skin type!",
    content: "I've been using this for 3 months now and I'm impressed with how light it feels while still providing good coverage. Perfect for daily wear.",
    isVerified: true,
    helpfulCount: 24
  },
  {
    id: 2,
    user: "Emily R.",
    rating: 4,
    date: "2024-02-10",
    title: "Great but pricey",
    content: "The quality is undeniable - it gives a beautiful natural finish. However, it is on the expensive side. Still, I would recommend it for special occasions.",
    isVerified: true,
    helpfulCount: 15
  },
  // Add more reviews...
]

export function ReviewSection() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [reviews, setReviews] = useState(dummyReviews)

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <section className="py-12">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-medium mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={`text-xl ${star <= averageRating ? 'text-black' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
              <span className="text-lg">({reviews.length})</span>
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Write a Review
          </button>
        </div>

        <div className="grid gap-6">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {isFormOpen && (
          <AddReviewForm 
            onClose={() => setIsFormOpen(false)}
            onSubmit={(newReview) => {
              setReviews(prev => [...prev, { id: prev.length + 1, ...newReview }])
              setIsFormOpen(false)
            }}
          />
        )}
      </div>
    </section>
  )
} 