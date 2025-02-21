import React, { useState, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import OrderModal from "./OrderModal";

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [product.images.length]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-white  border shadow-md rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-48 object-contain"
        />

        <div className="absolute top-1/2 transform -translate-y-1/2 left-2 text-white cursor-pointer">
          <ChevronLeft size={24} onClick={handlePrevImage} />
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-2 text-white cursor-pointer">
          <ChevronRight size={24} onClick={handleNextImage} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[20px]  turncate font-medium">{product.name}</h3>
        <div className="grid grid-cols-2 mt-[2px]">
          {product.wholesalePriceTiers.map((tier, index) => (
            <div key={index} className="mb-2 flex gap-[2px] items-center">
              <p className="text-gray-600 text-[14px] font-medium">₹{tier.pricePerUnit} piece</p>
              <p>-</p>
              <p className="text-gray-500 text-sm">{tier.quantity} qty</p>
            </div> 
          ))}
        </div>

        <OrderModal product={product}></OrderModal>
      </div>
    </div>
  );
};

export default ProductCard;
