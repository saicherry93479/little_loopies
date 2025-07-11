import { useWishlistStore } from '@/lib/store/wishlist';
import { useCartStore } from '@/lib/store/cart';
import { useNavigate } from 'astro:transitions/client';
import { useState } from 'react';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = (item: any) => {
    setAddingToCart(item.id);
    setTimeout(() => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        brand: item.brand
      });
      setAddingToCart(null);
    }, 500);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        <div className="bg-gray-50 rounded-lg p-8">
          <p className="text-xl mb-6">Your wishlist is empty</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
              >
                ×
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium truncate">{item.name}</h3>
              {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
              <p className="mt-2 font-medium">₹{item.price.toFixed(2)}</p>
              
              <div className="mt-4 space-y-2">
                <button 
                  onClick={() => handleAddToCart(item)}
                  disabled={addingToCart === item.id}
                  className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {addingToCart === item.id ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="w-full py-2 border border-black rounded-md hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}