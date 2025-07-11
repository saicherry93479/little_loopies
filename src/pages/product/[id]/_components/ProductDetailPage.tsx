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
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  
  const productRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  
  useEffect(() => {
    //