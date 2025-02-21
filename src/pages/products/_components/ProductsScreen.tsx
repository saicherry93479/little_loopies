import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Filters } from "./Filters";
import { Breadcrumb } from "./Breadcrumb";
import { ProductCardSkeleton } from "../../../components/ProductCardSkeleton";
import { ProductCard } from "../../../components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    brand: "Nike",
    price: 1499.99,
    originalPrice: 1999.99,
    discount: 25,
    rating: 4.5,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8",
    isPopular: true
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    brand: "Levi's",
    price: 2999.99,
    originalPrice: 3999.99,
    discount: 25,
    rating: 4.7,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    isPopular: true
  },
  {
    id: 3,
    name: "Summer Floral Dress",
    brand: "Zara",
    price: 3499.99,
    originalPrice: 4999.99,
    discount: 30,
    rating: 4.6,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
    isPopular: false
  },
  // Add at least 20 more products...
  {
    id: 4,
    name: "Leather Sneakers",
    brand: "Adidas",
    price: 4999.99,
    originalPrice: 6999.99,
    discount: 28,
    rating: 4.8,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    isPopular: true
  },
  // ... Add more products
];

// Add more products by duplicating and modifying the above format
const generateMoreProducts = () => {
  const brands = ["Nike", "Adidas", "Puma", "Zara", "H&M", "Gucci", "Levi's", "Under Armour"];
  const productTypes = ["T-Shirt", "Jeans", "Dress", "Sneakers", "Jacket", "Hoodie", "Skirt", "Shorts"];
  
  return Array.from({ length: 40 }, (_, i) => ({
    id: i + mockProducts.length + 1,
    name: `${brands[Math.floor(Math.random() * brands.length)]} ${productTypes[Math.floor(Math.random() * productTypes.length)]}`,
    brand: brands[Math.floor(Math.random() * brands.length)],
    price: Math.floor(Math.random() * 8000) + 1000,
    originalPrice: Math.floor(Math.random() * 10000) + 2000,
    discount: Math.floor(Math.random() * 40) + 10,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 500) + 50,
    image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}`,
    isPopular: Math.random() > 0.7
  }));
};

const allProducts = [...mockProducts, ...generateMoreProducts()];

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

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';

export default function Products() {
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    gender: [],
    priceRange: [0, 10000],
    rating: null,
    brands: [],
    size: [],
    color: [],
    material: [],
    occasion: []
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const productsGridRef = useRef<HTMLDivElement>(null)

  // Function to animate products transition
  const animateProductsChange = (newProducts: typeof products) => {
    if (productsGridRef.current) {
      gsap.to(productsGridRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          setProducts(newProducts)
          gsap.fromTo(
            productsGridRef.current!.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              stagger: 0.05,
              ease: "power2.out"
            }
          )
        }
      })
    }
  }

  // Sort products with animation
  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'popular':
          return b.reviews - a.reviews
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating)
        default:
          return 0
      }
    })
    animateProductsChange(sortedProducts)
  }, [sortBy])

  // Filter products with animation
  useEffect(() => {
    const filteredProducts = allProducts.filter(product => {
      // Apply all filters here
      const matchesCategory = filters.category.length === 0 || 
        filters.category.includes(product.category)
      const matchesBrand = filters.brands.length === 0 || 
        filters.brands.includes(product.brand)
      const matchesPrice = product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      // Add more filter conditions as needed

      return matchesCategory && matchesBrand && matchesPrice
    })
    animateProductsChange(filteredProducts)
  }, [filters])

  // Sort dropdown animation
  const sortRef = useRef<HTMLDivElement>(null)
  
  const handleSortClick = () => {
    if (sortRef.current) {
      gsap.fromTo(sortRef.current,
        { opacity: 0.5, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.2 }
      )
    }
  }

  // Simulate loading products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        const allProducts = [...mockProducts, ...generateMoreProducts()]
        setProducts(allProducts)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Product grid animation
  useEffect(() => {
    if (!loading && productsGridRef.current) {
      gsap.fromTo(
        productsGridRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out"
        }
      )
    }
  }, [loading])

  return (
      <div className="max-w-[1600px] mx-auto px-4">
        <Breadcrumb />

        <div className="flex gap-8 py-8">
          {/* Desktop Filters */}
          <Filters filters={filters} setFilters={setFilters} />

          <div className="flex-1">
            {/* Sort and Mobile Filters */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden px-4 py-2 border rounded-md"
              >
                Filters
              </button>

              <div ref={sortRef} className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  onClick={handleSortClick}
                  className="border rounded-md px-3 py-2 bg-white"
                  disabled={loading}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Popular</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid with Skeletons */}
            <div 
              ref={productsGridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {loading ? (
                // Show skeletons while loading
                [...Array(12)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : (
                // Show actual products
                products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <Filters
            filters={filters}
            setFilters={setFilters}
            isMobile
            onClose={() => setShowMobileFilters(false)}
          />
        )}
      </div>
  );
}
