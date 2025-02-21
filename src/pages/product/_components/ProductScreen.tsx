import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ReviewSection } from "./ReviewSection";

gsap.registerPlugin(ScrollTrigger);

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const mainRef = useRef(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Product images animation
      gsap.from(imageRefs.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Product details animation
      gsap.from(".product-details > *", {
        opacity: 0,
        x: 50,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".product-details",
          start: "top 80%",
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=700",
            "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=500&h=700",
          ].map((src, index) => (
            <img
              key={index}
              ref={(el) => (imageRefs.current[index] = el)}
              src={src}
              alt={`Product view ${index + 1}`}
              className="w-full h-[600px] object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Product Details */}
        <div className="product-details space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-black">
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.7)</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-medium">
            VITALUMIÈRE AQUA Ultra-Light Skin Perfecting Sunscreen Makeup
          </h1>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-medium">$89.99</span>
              <span className="text-lg text-gray-500 line-through">$99.99</span>
              <span className="text-sm text-green-600 font-medium">
                10% OFF
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex border border-gray-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full py-4 bg-[#157E64] text-white rounded-md hover:bg-[#126E54] transition-colors">
                Add to Bag
              </button>
              <button className="w-full py-4 border-2 border-black rounded-md hover:bg-gray-50 transition-colors">
                Add to Wishlist
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-6 space-y-4">
              <p className="text-sm">
                Free returns anytime • Sold by Nordstrom
              </p>
              <div className="p-4 bg-purple-100 rounded-md">
                <p className="text-sm font-medium">
                  Nordy Club members earn 3X the points on beauty!
                </p>
                <button className="text-sm text-black underline mt-2">
                  See restrictions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add ReviewSection below product details */}
      <ReviewSection />
    </main>
  );
};

export default ProductPage;
