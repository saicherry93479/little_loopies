import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'

interface AddReviewFormProps {
  onClose: () => void
  onSubmit: (review: {
    rating: number
    title: string
    content: string
  }) => void
}

export function AddReviewForm({ onClose, onSubmit }: AddReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: {title?: string; content?: string} = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!content.trim()) newErrors.content = 'Review content is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSubmit({
        rating,
        title,
        content
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Write a Review</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors({...errors, title: undefined})
              }}
              className={errors.title ? "border-red-500" : ""}
              placeholder="Summarize your experience"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Review</label>
            <Textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (errors.content) setErrors({...errors, content: undefined})
              }}
              className={`min-h-[120px] ${errors.content ? "border-red-500" : ""}`}
              placeholder="Share your experience with this product"
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}