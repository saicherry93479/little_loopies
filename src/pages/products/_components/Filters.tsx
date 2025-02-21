import { useState, useEffect, useRef } from 'react'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { gsap } from 'gsap'

export type FilterState = {
  category: string[];
  gender: string[];
  priceRange: [number, number];
  rating: number | null;
  brands: string[];
  size: string[];
  color: string[];
  material: string[];
  occasion: string[];
};

type FiltersProps = {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  isMobile?: boolean
  onClose?: () => void
}

// Add these type definitions
type FilterSectionProps = {
  title: string
  children: React.ReactNode
  expanded: boolean
  setExpanded: () => void
}

type CheckboxItemProps = {
  label: string
  checked: boolean
  onChange: () => void
}

export function Filters({ filters, setFilters, isMobile, onClose }: FiltersProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMobile && modalRef.current && contentRef.current) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      
      // Animate modal background
      gsap.fromTo(modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )

      // Animate filter panel sliding up
      gsap.fromTo(contentRef.current,
        { y: '100%' },
        { y: 0, duration: 0.4, ease: 'power3.out' }
      )
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile])

  const handleClose = () => {
    if (isMobile && modalRef.current && contentRef.current) {
      // Animate modal closing
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.2
      })

      // Animate filter panel sliding down
      gsap.to(contentRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          onClose?.()
          document.body.style.overflow = 'unset'
        }
      })
    } else {
      onClose?.()
    }
  }

  const [expanded, setExpanded] = useState({
    category: true,
    gender: true,
    price: true,
    rating: true,
    brands: true,
    size: true,
    color: true,
    material: true,
    occasion: true
  })

  const categories = [
    "T-Shirts", "Dresses", "Pants", "Shoes", "Accessories", "Jackets",
    "Sweaters", "Skirts", "Shorts", "Activewear"
  ]

  const brands = [
    "Nike", "Adidas", "H&M", "Zara", "Gap", "Carter's", "Gucci", "Prada",
    "Uniqlo", "Levi's", "Tommy Hilfiger", "Ralph Lauren"
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"]
  
  const colors = [
    "Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink",
    "Brown", "Gray", "Navy", "Beige"
  ]

  const materials = [
    "Cotton", "Polyester", "Wool", "Silk", "Linen", "Denim", "Leather",
    "Velvet", "Satin", "Nylon"
  ]

  const occasions = [
    "Casual", "Formal", "Party", "Sports", "Beach", "Work", "Wedding",
    "Outdoor", "Travel"
  ]

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [type]: filters[type].includes(value)
        ? filters[type].filter(v => v !== value)
        : [...filters[type], value]
    })
  }

  const filterContent = (
    <>
      {/* Filter sections */}
      <FilterSection
        title="Category"
        expanded={expanded.category}
        setExpanded={() => setExpanded({...expanded, category: !expanded.category})}
      >
        {categories.map(category => (
          <CheckboxItem
            key={category}
            label={category}
            checked={filters.category.includes(category)}
            onChange={() => toggleFilter('category', category)}
          />
        ))}
      </FilterSection>

      <FilterSection
        title="Brands"
        expanded={expanded.brands}
        setExpanded={() => setExpanded({...expanded, brands: !expanded.brands})}
      >
        {brands.map(brand => (
          <CheckboxItem
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => toggleFilter('brands', brand)}
          />
        ))}
      </FilterSection>

      <FilterSection
        title="Price Range"
        expanded={expanded.price}
        setExpanded={() => setExpanded({...expanded, price: !expanded.price})}
      >
        <div className="px-2 py-4">
          <Slider
            range
            min={0}
            max={10000}
            value={filters.priceRange}
            onChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      {/* Add other filter sections */}
    </>
  )

  if (isMobile) {
    return (
      <div 
        ref={modalRef}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={(e) => e.target === modalRef.current && handleClose()}
      >
        <div 
          ref={contentRef}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl"
          style={{ 
            transform: 'translateY(100%)',
            maxHeight: 'calc(100vh - 60px)'
          }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b z-10 px-4 py-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Filters</h2>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="overflow-y-auto px-4 pb-32">
            {filterContent}
          </div>

          {/* Footer with View Results button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <button
              onClick={handleClose}
              className="w-full py-3 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition-colors"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 flex-shrink-0 hidden md:block">
      {filterContent}
    </div>
  )
}

// Update helper components with type definitions
function FilterSection({ title, children, expanded, setExpanded }: FilterSectionProps) {
  return (
    <div className="mb-6">
      <button 
        className="flex items-center justify-between w-full py-4 border-b"
        onClick={setExpanded}
      >
        <span className="font-medium">{title}</span>
        <svg className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} 
             viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-gray-300"
      />
      <span>{label}</span>
    </label>
  )
} 