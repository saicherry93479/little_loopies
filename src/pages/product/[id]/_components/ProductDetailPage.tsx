import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { ReviewSection } from '../../_components/ReviewSection';

// Mock product data - in a real app, you would fetch this from an API
const getProductById = (id: string) => {
  // This would be replaced with an actual API call
  return {
    id,
    name: "Dinosaur Print Kids T-Shirt",
    brand: "Little Loopies",
    description: "Our adorable dinosaur print t-shirt is made from 100% organic cotton, providing exceptional comfort and durability for your little one. Perfect for everyday play, this fun piece features a classic fit and vibrant colors that kids love.",
    price: 599.99,
    originalPrice: 799.99,
    discount: 25,
    rating: 4.8,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&h=1000",
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=1000",
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&h=1000"
    ],
    sizes: ["0-3 months", "3-6 months", "6-9 months", "9-12 months", "1-2 years", "2-3 years"],
    colors: ["Blue", "Green", "Yellow", "Red", "Orange"],
    inStock: true,
    features: [
      "100% organic cotton",
      "Breathable fabric",
      "Machine washable",
      "Sustainable production",
      "Gentle on sensitive skin",
      "Fun dinosaur print design"
    ]
  };
};

export default function ProductDetailPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [currentVariant, setCurrentVariant] = useState<any>(null);
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  
  const productRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const productData = getProductById(productId);
      setProduct(productData);
      // Set default variant if available
      if (productData.variants && productData.variants.length > 0) {
        setCurrentVariant(productData.variants[0]);
      }
      setLoading(false);
    }, 800);
  }, [productId]);
  
  useEffect(() => {
    if (!loading && product && productRef.current) {
      // Initial animation only when product first loads
      if (!product.animatedInitially) {
        const ctx = gsap.context(() => {
          // Product details animation
          gsap.from(".product-details > *", {
            opacity: 0,
            x: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          });
        }, productRef);
        
        product.animatedInitially = true;
        return () => ctx.revert();
      }
    }
  }, [loading, product]);
  
  useEffect(() => {
    // Update price and images when variant changes
    if (selectedColor && selectedSize && product?.variants) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      
      if (variant) {
        setCurrentVariant(variant);
      }
    }
  }, [selectedColor, selectedSize, product]);
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
    if (!selectedColor) {
      setError('Please select a color');
      return;
    }
    
    setError('');
    addToCart({
      id: product.id,
      name: product.name,
      price: currentVariant?.price || product.price,
      quantity,
      image: product.images[0],
      brand: product.brand
    });
    
    // Show success animation
    const button = document.querySelector('.add-to-cart-btn');
    if (button) {
      gsap.to(button, {
        backgroundColor: '#4CAF50',
        duration: 0.3,
        onComplete: () => {
          gsap.to(button, {
            backgroundColor: '#000',
            duration: 0.3,
            delay: 0.5
          });
        }
      });
    }
  };
  
  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      brand: product.brand
    });
    
    // Show success animation
    const button = document.querySelector('.add-to-wishlist-btn');
    if (button) {
      gsap.to(button, {
        backgroundColor: '#E91E63',
        color: 'white',
        duration: 0.3,
        onComplete: () => {
          gsap.to(button, {
            backgroundColor: 'white',
            color: 'black',
            duration: 0.3,
            delay: 0.5
          });
        }
      });
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-pulse bg-gray-200 h-[600px] rounded-lg"></div>
          <div className="space-y-6">
            <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-1/3 rounded"></div>
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
            </div>
            <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div ref={productRef} className="max-w-[1200px] mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-[500px] overflow-hidden rounded-lg">
            {product.images.map((src, index) => (
              <img
                key={index}
                ref={(el) => (imageRefs.current[index] = el)}
                src={src}
                alt={`${product.name} - View ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            
            {/* Navigation arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button 
                onClick={() => setCurrentImageIndex(prev => 
                  prev === 0 ? product.images.length - 1 : prev - 1
                )}
                className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
              >
                ‹
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => 
                  prev === product.images.length - 1 ? 0 : prev + 1
                )}
                className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
              >
                ›
              </button>
            </div>
          </div>
          
          {/* Thumbnail navigation */}
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((src, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                  index === currentImageIndex ? 'ring-2 ring-black' : ''
                }`}
              >
                <img 
                  src={src} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="product-details space-y-6">
          <div>
            <p className="text-lg text-gray-600">{product.brand}</p>
            <h1 className="text-3xl font-medium">{product.name}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  className={`text-lg ${
                    star <= Math.floor(product.rating) 
                      ? 'text-black' 
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.rating}) {product.reviews} reviews
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-medium">₹{product.price.toFixed(2)}</span>
              <span className="text-lg text-gray-500 line-through">
                ₹{(currentVariant?.originalPrice || product.originalPrice).toFixed(2)}
              </span>
              <span className="text-sm text-green-600 font-medium">
                {product.discount}% OFF
              </span>
            </div>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex border border-gray-300 w-fit">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="add-to-cart-btn flex-1 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="add-to-wishlist-btn flex-1 py-3 border-2 border-black rounded-md hover:bg-gray-50 transition-colors"
                disabled={isInWishlist(product.id)}
              >
                {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Product Details</h2>
            <p className="text-gray-700 mb-4">{product.description}</p>
            
            <h3 className="font-medium mt-4 mb-2">Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {product.features?.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <ReviewSection />
    </div>
  );
}