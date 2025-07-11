import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { ReviewSection } from '../../_components/ReviewSection';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
    variants: [
      {
        color: "Blue",
        size: "0-3 months",
        price: 599.99,
        originalPrice: 799.99,
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&h=1000",
          "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=1000"
        ]
      },
      {
        color: "Green",
        size: "0-3 months",
        price: 599.99,
        originalPrice: 799.99,
        stock: 10,
        images: [
          "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&h=1000",
          "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=1000"
        ]
      },
      {
        color: "Blue",
        size: "3-6 months",
        price: 649.99,
        originalPrice: 849.99,
        stock: 8,
        images: [
          "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&h=1000",
          "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=1000"
        ]
      }
    ],
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
  const { toast } = useToast();
  
  const productRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  
  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      try {
        // In a real app, this would be an API call
        const productData = getProductById(productId);
        setProduct(productData);
        
        // Set default selections
        if (productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        
        // Find the matching variant
        const variant = productData.variants.find(
          (v: any) => v.color === productData.colors[0] && v.size === productData.sizes[0]
        );
        if (variant) {
          setCurrentVariant(variant);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  useEffect(() => {
    if (!product) return;
    
    // Find the matching variant when selections change
    const variant = product.variants.find(
      (v: any) => v.color === selectedColor && v.size === selectedSize
    );
    
    if (variant) {
      setCurrentVariant(variant);
      // Update images if the variant has specific images
      if (variant.images && variant.images.length > 0) {
        // No animation for image change
        setCurrentImageIndex(0);
      }
    } else {
      setCurrentVariant(null);
    }
  }, [selectedColor, selectedSize, product]);
  
  useEffect(() => {
    if (!loading && productRef.current) {
      // Animate product details on load
      gsap.fromTo(
        productRef.current.querySelectorAll('.animate-in'),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, [loading]);
  
  const handleAddToCart = () => {
    if (!currentVariant) {
      setError('Please select a size and color');
      return;
    }
    
    addToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: product.name,
      price: currentVariant.price,
      quantity,
      image: currentVariant.images[0] || product.images[0],
      brand: product.brand,
      variant: `${selectedColor}, ${selectedSize}`
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedColor}, ${selectedSize}) added to your cart`
    });
  };
  
  const handleAddToWishlist = () => {
    if (!product) return;
    
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      brand: product.brand
    });
    
    toast({
      title: "Added to wishlist",
      description: `${product.name} added to your wishlist`
    });
  };
  
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p>{error || 'Product not found'}</p>
        <Button asChild className="mt-6">
          <a href="/products">Back to Products</a>
        </Button>
      </div>
    );
  }
  
  const variantImages = currentVariant?.images || product.images;
  
  return (
    <div ref={productRef} className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
            <a href="/products" className="text-gray-500 hover:text-gray-700">Kids</a>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <img
              src={variantImages[currentImageIndex]}
              alt={`${product.name} - View ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          <div className="grid grid-cols-5 gap-2">
            {variantImages.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={`aspect-square rounded-md overflow-hidden border-2 ${
                  index === currentImageIndex ? 'border-black' : 'border-transparent'
                }`}
              >
                <img
                  ref={(el) => (imageRefs.current[index] = el)}
                  src={image}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          {/* Brand and Title */}
          <div className="animate-in">
            <h4 className="text-lg text-gray-600">{product.brand}</h4>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 animate-in">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= product.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="animate-in">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                ₹{currentVariant?.price || product.price}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ₹{currentVariant?.originalPrice || product.originalPrice}
              </span>
              <span className="text-sm text-green-600 font-medium">
                ({product.discount}% OFF)
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Inclusive of all taxes
            </p>
          </div>
          
          {/* Color Selection */}
          <div className="animate-in">
            <h3 className="text-sm font-medium mb-2">Color: {selectedColor}</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color
                      ? 'border-black'
                      : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor: color.toLowerCase(),
                    boxShadow: selectedColor === color ? '0 0 0 2px white inset' : 'none'
                  }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="animate-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Size: {selectedSize}</h3>
              <button className="text-sm text-blue-600 hover:underline">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((size: string) => {
                const isAvailable = product.variants.some(
                  (v: any) => v.size === size && v.color === selectedColor && v.stock > 0
                );
                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    className={`py-2 border rounded-md text-sm ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : isAvailable
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isAvailable}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="animate-in">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex border border-gray-300 rounded-md w-32">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border-r border-gray-300"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 h-10 text-center border-none focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center border-l border-gray-300"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Stock Status */}
          {currentVariant && (
            <p className={`text-sm ${currentVariant.stock > 0 ? 'text-green-600' : 'text-red-600'} animate-in`}>
              {currentVariant.stock > 0 
                ? currentVariant.stock > 10 
                  ? 'In Stock' 
                  : `Only ${currentVariant.stock} left in stock!` 
                : 'Out of Stock'}
            </p>
          )}
          
          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 animate-in">{error}</p>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 animate-in">
            <Button 
              onClick={handleAddToCart}
              className="w-full py-6 text-lg bg-black hover:bg-gray-800"
              disabled={!currentVariant || currentVariant.stock <= 0}
            >
              Add to Cart
            </Button>
            
            <Button
              onClick={handleAddToWishlist}
              variant="outline"
              className="w-full py-6 text-lg border-black text-black hover:bg-gray-100"
              disabled={isInWishlist(product.id)}
            >
              {isInWishlist(product.id) ? 'Added to Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
          
          {/* Product Description */}
          <div className="border-t pt-6 animate-in">
            <h3 className="text-lg font-medium mb-3">Product Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Product Features */}
          <div className="animate-in">
            <h3 className="text-lg font-medium mb-3">Features</h3>
            <ul className="list-disc pl-5 space-y-1">
              {product.features.map((feature: string, index: number) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>
          
          {/* Delivery Information */}
          <div className="border-t pt-6 animate-in">
            <h3 className="text-lg font-medium mb-3">Delivery & Returns</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Free standard delivery on orders above ₹999</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Easy 30-day returns</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>COD available on orders above ₹499</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Reviews Section */}
      <ReviewSection productId={productId} />
    </div>
  );
}