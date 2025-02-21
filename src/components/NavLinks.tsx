import { useState } from 'react'

const navItems = [
  { 
    label: 'Sale', 
    color: 'text-red-700',
    items: ['Women', 'Men', 'Kids', 'Home', 'Beauty'] 
  },
  { 
    label: 'New',
    items: ['New Arrivals', 'What\'s Trending', 'Best Sellers'] 
  },
  { 
    label: 'Women',
    items: ['Clothing', 'Shoes', 'Handbags', 'Jewelry', 'Beauty'] 
  },
  { 
    label: 'Men',
    items: ['Clothing', 'Shoes', 'Accessories', 'Grooming'] 
  },
  { 
    label: 'Beauty',
    items: ['Makeup', 'Skincare', 'Haircare', 'Fragrance'] 
  },
  { 
    label: 'Shoes',
    items: ['Women\'s Shoes', 'Men\'s Shoes', 'Kids\' Shoes'] 
  },
  { 
    label: 'Accessories',
    items: ['Handbags', 'Jewelry', 'Watches', 'Sunglasses','Handbags', 'Jewelry', 'Watches', 'Sunglasses','Handbags', 'Jewelry', 'Watches', 'Sunglasses','Handbags', 'Jewelry', 'Watches', 'Sunglasses'] 
  },
  { 
    label: 'Kids',
    items: ['Girls', 'Boys', 'Baby', 'Toys'] 
  },
  { 
    label: 'Designer',
    items: ['Women', 'Men', 'Kids', 'Accessories'] 
  },
  { 
    label: 'Home',
    items: ['Bedding', 'Bath', 'Decor', 'Kitchen'] 
  },
  { 
    label: 'Gifts',
    items: ['For Her', 'For Him', 'For Kids', 'For Home'] 
  },
  { 
    label: 'Explore',
    items: ['Sale', 'New Arrivals', 'Trending Now'] 
  },
]

export function NavLinks() {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto">
        {/* Main Navigation */}
        <div className="flex justify-between items-center px-4 h-16">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group h-full"
              onMouseEnter={() => setActiveItem(item.label)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <button
                className={`h-full px-4 flex items-center space-x-1 ${
                  item.color || 'text-gray-800'
                } hover:text-gray-600 relative`}
              >
                <span>{item.label}</span>
                {/* Underline effect */}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-200 ${
                  activeItem === item.label ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </button>

              {/* Dropdown Menu */}
              {activeItem === item.label && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg py-2 z-50">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem}
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      {subItem}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
} 