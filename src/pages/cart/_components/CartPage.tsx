import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useAuthStore } from '@/lib/store/auth';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?returnUrl=${encodeURIComponent('/checkout')}`;
      return;
    }
    
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      navigate('/checkout/success');
      setIsCheckingOut(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-gray-50 rounded-lg p-8">
          <p className="text-xl mb-6">Your cart is empty</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Items */}
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex border-b pb-6">
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-end">
                    <div className="flex items-center border">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 font-bold flex justify-between">
              <span>Total</span>
              <span>₹{(getTotalPrice() * 1.18).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex justify-center items-center"
          >
            {isCheckingOut ? 'Processing...' : isAuthenticated ? 'Checkout' : 'Login to Checkout'}
          </button>
          
          <div className="mt-4">
            <a 
              href='/products'
              className="w-full py-3 border border-black rounded-md hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}