import { useEffect, useState } from 'react';

export default function CheckoutSuccessPage() {
  const [orderNumber] = useState(`ORD-${Math.floor(Math.random() * 1000000)}`);
  const [countdown, setCountdown] = useState(10);

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href='/'
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase.</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-xl font-medium">{orderNumber}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500">Order Status</p>
          <p className="text-xl font-medium">Processing</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Estimated Delivery</p>
          <p className="text-xl font-medium">3-5 Business Days</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <a 
          href='/products'
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </a>
        
        <p className="text-sm text-gray-500">
          You will be redirected to the home page in {countdown} seconds
        </p>
      </div>
    </div>
  );
}