interface ReviewCardProps {
  review: {
    user: string
    rating: number
    date: string
    title: string
    content: string
    isVerified: boolean
    helpfulCount: number
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium mb-1">{review.title}</h3>
          <div className="flex gap-2 items-center text-sm text-gray-600">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={star <= review.rating ? 'text-black' : 'text-gray-300'}>
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

      <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        Helpful ({review.helpfulCount})
      </button>
    </div>
  )
} 