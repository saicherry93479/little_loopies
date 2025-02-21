import { useState } from 'react'

const categories = [
  "Women's Cold-Weather Shop",
  "New Markdowns",
  "Women's New Arrivals Under $100",
  "Men's New Arrivals Under $100",
  "Makeup",
  "Beauty & Fragrance Sale"
]

export function CategoryTabs() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8 overflow-x-auto hide-scrollbar">
        {categories.map((category, index) => (
          <button
            key={category}
            className={`
              py-2 px-1 -mb-px whitespace-nowrap
              ${index === activeTab 
                ? 'border-b-2 border-black font-medium' 
                : 'text-gray-600'}
            `}
            onClick={() => setActiveTab(index)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
} 