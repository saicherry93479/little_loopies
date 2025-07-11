import { useState } from 'react'

const navItems = [
  { 
    label: 'Kids Sale', 
    color: 'text-red-700',
    items: ['Baby', 'Toddler', 'Kids', 'Shoes', 'Accessories'] 
  },
  { 
    label: 'New Arrivals',
    items: ['Baby Collection', 'Toddler Collection', 'Kids Collection', 'Seasonal Favorites'] 
  },
  { 
    label: 'Baby (0-12m)',
    items: ['Bodysuits', 'Rompers', 'Sleepwear', 'Sets', 'Accessories'] 
  },
  { 
    label: 'Toddler (1-3y)',
    items: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Sleepwear'] 
  },
  { 
    label: 'Kids (4-14y)',
    items: ['Boys', 'Girls', 'Unisex', 'School Uniforms', 'Special Occasions'] 
  },
  { 
    label: 'Shoes & Accessories',
    items: ['Baby Shoes', 'Toddler Shoes', 'Kids Shoes', 'Socks', 'Hats', 'Bags'] 
  },
  { 
    label: 'Collections',
    items: ['Organic Cotton', 'Dinosaur Collection', 'Animal Friends', 'Seasonal', 'Character Favorites', 'Matching Family'] 
  },
  { 
    label: 'Occasions',
    items: ['Everyday Play', 'Birthday', 'Holiday', 'Special Events', 'Sleepwear'] 
  },
  { 
    label: 'Brands',
    items: ['Little Loopies', 'Carter\'s', 'OshKosh', 'Gap Kids', 'Disney'] 
  },
  { 
    label: 'Gifts',
    items: ['Baby Shower', 'Birthday', 'Holiday', 'Gift Sets', 'Gift Cards'] 
  },
  { 
    label: 'Sale',
    items: ['Clearance', 'Special Offers', 'Bundle Deals', 'Seasonal Sale'] 
  },
  { 
    label: 'Explore',
    items: ['New Arrivals', 'Bestsellers', 'Trending Now', 'Eco-Friendly'] 
  },
]

export function NavLinks() {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  
  const handleNavClick = (item: any) => {
    if (item.label === 'Men') {
      return '/products?category=men'
    } else if (item.label === 'Women') {
      return '/products?category=women'
    } else if (item.label === 'Kids') {
      return '/products?category=kids'
    } else if (item.label === 'Beauty') {
      return '/products?category=beauty'
    } else if (item.label === 'Home') {
      return '/products?category=home'
    } else {
      return '/products'
    }
  }

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
              <a
                className={`h-full px-4 flex items-center space-x-1 ${
                  item.color || 'text-gray-800'
                } hover:text-gray-600 relative`}
                href ={handleNavClick(item)}
              >
                <span>{item.label}</span>
                {/* Underline effect */}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-200 ${
                  activeItem === item.label ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </a>

              {/* Dropdown Menu */}
              {activeItem === item.label && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg py-2 z-50">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem}
                      href={`/products?category=${subItem.toLowerCase()}`}
                     
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