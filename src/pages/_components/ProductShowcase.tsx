import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProductCard } from '../../components/ProductCard'

gsap.registerPlugin(ScrollTrigger)

const productsByCategory = {
  trending: [
    {
      id: 1,
      name: "Dinosaur Print T-Shirt",
      brand: "Carter's",
      price: 599.99,
      originalPrice: 899.99,
      discount: 33,
      rating: 4.8,
      reviews: 420,
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&h=700",
      isPopular: true
    },
    {
      id: 2,
      name: "Rainbow Sneakers",
      brand: "Nike Kids",
      price: 1299.99,
      originalPrice: 1599.99,
      discount: 19,
      rating: 4.9,
      reviews: 350,
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&h=700",
      isPopular: true
    },
    {
      id: 3,
      name: "Unicorn Backpack",
      brand: "Skip Hop",
      price: 899.99,
      originalPrice: 1199.99,
      discount: 25,
      rating: 4.7,
      reviews: 280,
      image: "https://images.unsplash.com/photo-1617006097724-d751b0c75adf?w=500&h=700",
      isPopular: true
    }
  ],
  newArrivals: [
    {
      id: 4,
      name: "Space Adventure PJs",
      brand: "GAP Kids",
      price: 799.99,
      originalPrice: 999.99,
      discount: 20,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=700",
      isNew: true
    },
    {
      id: 5,
      name: "Premium Denim Jacket",
      brand: "Levi's",
      price: 13999.99,
      originalPrice: 15999.99,
      discount: 13,
      rating: 4.4,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&h=700",
      isNew: true
    },
    {
      id: 6,
      name: "Smart Running Shoes",
      brand: "Adidas",
      price: 11999.99,
      originalPrice: 13999.99,
      discount: 14,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=700",
      isNew: true
    },
    {
      id: 7,
      name: "Crossbody Bag",
      brand: "Coach",
      price: 17999.99,
      originalPrice: 19999.99,
      discount: 10,
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=700",
      isNew: true
    },
    {
      id: 8,
      name: "Cashmere Sweater",
      brand: "Ralph Lauren",
      price: 21999.99,
      originalPrice: 24999.99,
      discount: 12,
      rating: 4.8,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=700",
      isNew: true
    },
    {
      id: 9,
      name: "Designer Wallet",
      brand: "Gucci",
      price: 34999.99,
      originalPrice: 39999.99,
      discount: 13,
      rating: 4.9,
      reviews: 34,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=700",
      isNew: true
    }
  ],
  bestSellers: [
    {
      id: 10,
      name: "Animal Friends Hoodie",
      brand: "H&M Kids",
      price: 699.99,
      originalPrice: 899.99,
      discount: 22,
      rating: 4.8,
      reviews: 890,
      image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=700",
      isBestSeller: true
    },
    {
      id: 11,
      name: "Classic White Sneakers",
      brand: "Common Projects",
      price: 9999.99,
      originalPrice: 12999.99,
      discount: 23,
      rating: 4.8,
      reviews: 3456,
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=700",
      isBestSeller: true
    },
    {
      id: 12,
      name: "Leather Belt",
      brand: "Hugo Boss",
      price: 4999.99,
      originalPrice: 5999.99,
      discount: 17,
      rating: 4.6,
      reviews: 2890,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=700",
      isBestSeller: true
    },
    {
      id: 13,
      name: "Classic Dress Watch",
      brand: "Fossil",
      price: 14999.99,
      originalPrice: 17999.99,
      discount: 17,
      rating: 4.7,
      reviews: 4567,
      image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=500&h=700",
      isBestSeller: true
    },
    {
      id: 14,
      name: "Wool Coat",
      brand: "Burberry",
      price: 89999.99,
      originalPrice: 99999.99,
      discount: 10,
      rating: 4.9,
      reviews: 1890,
      image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&h=700",
      isBestSeller: true
    },
    {
      id: 15,
      name: "Designer Backpack",
      brand: "Herschel",
      price: 7999.99,
      originalPrice: 9999.99,
      discount: 20,
      rating: 4.7,
      reviews: 3245,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=700",
      isBestSeller: true
    }
  ],
  sale: [
    {
      id: 16,
      name: "Superhero Cape Set",
      brand: "Disney",
      price: 499.99,
      originalPrice: 999.99,
      discount: 50,
      rating: 4.9,
      reviews: 670,
      image: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=500&h=700",
      isSale: true
    },
    {
      id: 17,
      name: "Canvas Sneakers",
      brand: "Converse",
      price: 3499.99,
      originalPrice: 6999.99,
      discount: 50,
      rating: 4.4,
      reviews: 890,
      image: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=500&h=700",
      isSale: true
    },
    {
      id: 18,
      name: "Denim Shorts",
      brand: "H&M",
      price: 1499.99,
      originalPrice: 2999.99,
      discount: 50,
      rating: 4.2,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&h=700",
      isSale: true
    },
    {
      id: 19,
      name: "Printed T-Shirt",
      brand: "Tommy Hilfiger",
      price: 1999.99,
      originalPrice: 3999.99,
      discount: 50,
      rating: 4.5,
      reviews: 678,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=700",
      isSale: true
    },
    {
      id: 20,
      name: "Sports Socks Pack",
      brand: "Nike",
      price: 799.99,
      originalPrice: 1599.99,
      discount: 50,
      rating: 4.6,
      reviews: 1234,
      image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&h=700",
      isSale: true
    }
  ]
}

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('trending')
  const sectionRef = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const slider = sliderRef.current
    
    if (!section || !slider) return

    // Fade in animation for section
    gsap.fromTo(section, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        }
      }
    )
  }, [])

  // Products transition effect when tab changes
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    gsap.fromTo(
      slider.children,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      }
    )
  }, [activeTab])

  return (
    <section 
      ref={sectionRef}
      className="max-w-[1600px] mx-auto px-4 py-16"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">
          Top Picks for You
        </h2>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-3 md:gap-6">
          {Object.keys(productsByCategory).map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`relative px-4 py-2 text-sm md:text-base transition-colors
                ${activeTab === category 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {/* Underline effect */}
              <span 
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-200 
                  ${activeTab === category ? 'scale-x-100' : 'scale-x-0'}`} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-8">
        {/* Navigation buttons */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors hidden md:block">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        {/* Products grid/slider */}
        <div 
          ref={sliderRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
          {productsByCategory[activeTab as keyof typeof productsByCategory].map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors hidden md:block">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>
      </div>
    </section>
  )
} 