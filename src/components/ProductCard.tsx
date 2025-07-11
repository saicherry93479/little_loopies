import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'

interface ProductCardProps {
  product: {
    name: string
    brand: string
    price: number
    originalPrice: number
    discount: number
    rating: number
    reviews: number
    image: string
    isPopular?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore()
  

  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      brand: product.brand
    })
  }
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToWishlist({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand
    })
  }

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // Hover animation
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  }, [])

  return (
    <a 
      ref={cardRef}
      className="flex-shrink-0 w-[230px] cursor-pointer"
      href={`/product/${product.id}`}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-[353px] object-cover"
        />
        {product.isPopular && (
          <div className="absolute bottom-4 left-0 bg-white/90 px-3 py-1">
            <span className="text-sm font-medium">Popular</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{product.brand}</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAddToWishlist}
              className={`p-1 rounded-full ${isInWishlist(product.id.toString()) ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
              disabled={isInWishlist(product.id.toString())}
            >
              ♥
            </button>
            <button 
              onClick={handleAddToCart}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600"
            >
              🛒
            </button>
          </div>
        </div>

        <div className="mt-2">
          <span className="text-red-600 font-medium">
            ₹{product.price.toFixed(2)}
          </span>
          <span className="ml-2 text-red-600">
            ({product.discount}% off)
          </span>
        </div>

        <div className="mt-1 text-gray-800">
          <span className="line-through">
            ₹{product.originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i}
                className={`text-lg ${
                  i < Math.floor(product.rating) 
                    ? 'text-black' 
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-500">
            ({product.reviews})
          </span>
        </div>
      </div>
    </a>
  )
} 