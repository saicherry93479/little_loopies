import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  Tag,
  Package,
  Users,
  Percent,
  ChevronLeft,
  ChevronRight,
  Folders,
} from "lucide-react";

interface WholesaleTier {
  id: string;
  pricePerUnit: number;
  productId: string;
  quantity: number;
}

interface Category {
  categoryId: string;
  id: string;
  productId: string;
}

interface ProductDetailsProps {
  product?: {
    id: string;
    name: string;
    description: string;
    activeForUsers: string;
    userPrice: number;
    userDiscountPercentage: number;
    isWholesaleEnabled: string;
    images: string[];
    categories: Category[];
    wholesalePriceTiers: WholesaleTier[];
    createdAt: Date;
    updatedAt: Date;
  };
  children: React.ReactNode;
}

export default function ProductDetails({
  product = {
    id: "31885f51-aa5b-4013-97b4-2710f3b5dc49",
    name: "sample",
    description: "dsmn kjsdmlksmdmls;d",
    activeForUsers: "Yes",
    userPrice: 8779,
    userDiscountPercentage: 87,
    isWholesaleEnabled: "No",
    images: [
      "https://packedfreshly.s3.amazonaws.com/products/sample-piu87z.png",
      "https://packedfreshly.s3.amazonaws.com/products/sample-qp9823.png",
    ],
    categories: [
      {
        categoryId: "sampleemployee",
        id: "64cd8ba3-7bf9-4a32-a596-c56f100b5234",
        productId: "31885f51-aa5b-4013-97b4-2710f3b5dc49",
      },
    ],
    wholesalePriceTiers: [
      {
        id: "e821c1a1-bfeb-4013-8dff-cf72896f9ee5",
        pricePerUnit: 192,
        productId: "31885f51-aa5b-4013-97b4-2710f3b5dc49",
        quantity: 14,
      },
      {
        id: "e821c1a1-bfeb-4013-8dff-cf72896f9ee5",
        pricePerUnit: 192,
        productId: "31885f51-aa5b-4013-97b4-2710f3b5dc49",
        quantity: 14,
      },
      {
        id: "e821c1a1-bfeb-4013-8dff-cf72896f9ee5",
        pricePerUnit: 192,
        productId: "31885f51-aa5b-4013-97b4-2710f3b5dc49",
        quantity: 14,
      },
      {
        id: "e821c1a1-bfeb-4013-8dff-cf72896f9ee5",
        pricePerUnit: 192,
        productId: "31885f51-aa5b-4013-97b4-2710f3b5dc49",
        quantity: 14,
      },
      {
        id: "e821c1a1-bfeb-4013-8dff-cf72896f9ee5",
        pricePerUnit: 192,
        productId: "31885f51-aa5b-4013-97b4-2710f3b5dc49",
        quantity: 14,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  children,
}: ProductDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleExport = () => {
    console.log("Exporting product details...");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        triggerRef.current?.click();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div
          ref={triggerRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          {children}
        </div>
      </SheetTrigger>
      <SheetContent onClick={(e)=>{
        e.preventDefault()
        e.stopPropagation()
      }} className="w-[400px] sm:w-[540px] sm:max-w-[calc(100vw-2rem)]">
        <SheetHeader>
          <SheetTitle>Product Details - {product.name}</SheetTitle>
          <SheetDescription>
            View complete information about this product.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Images */}
            <div className="relative">
              <h3 className="text-lg font-medium mb-2">Product Images</h3>
              <Separator className="my-2" />
              <div className="relative h-64 w-full">
                <img
                  src={product.images[currentImageIndex]}
                  alt={`₹{product.name} - ₹{currentImageIndex + 1}`}
                  className="w-full h-full object-contain rounded-lg border-2 border-gray-200 shadow-md"
                />
                <div className="absolute inset-0 flex items-center justify-between p-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/80 hover:bg-white"
                    onClick={previousImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2 h-2  rounded-full transition-colors ₹{
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Basic Information
              </h3>
              <Separator className="my-2" />
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Name:</dt>
                  <dd>{product.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Description:</dt>
                  <dd className="text-right max-w-[60%]">
                    {product.description}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Active Status:</dt>
                  <dd
                    className={
                      product.activeForUsers === "Yes"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {product.activeForUsers}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Folders className="h-5 w-5" />
                Categories
              </h3>
              <Separator className="my-2" />
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {category.categoryId}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Package className="h-5 w-5" />
                Pricing Details
              </h3>
              <Separator className="my-2" />
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Base Price:</dt>
                  <dd>₹{product.userPrice.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Discount:</dt>
                  <dd>{product.userDiscountPercentage}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Final Price:</dt>
                  <dd className="font-medium">
                    ₹
                    {(
                      product.userPrice *
                      (1 - product.userDiscountPercentage / 100)
                    ).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Wholesale Information - Always show */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5" />
                Wholesale Pricing
                <span
                  className={`text-xs px-2 py-0.5 rounded ₹{
                    product.isWholesaleEnabled === "Yes"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.isWholesaleEnabled}
                </span>
              </h3>
              <Separator className="my-2" />
              <div className="space-y-2">
                {product.wholesalePriceTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex justify-between text-sm p-2 bg-gray-50 rounded-md"
                  >
                    <span>Quantity: {tier.quantity}+</span>
                    <span>₹{tier.pricePerUnit} per unit</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="mt-6 flex justify-between">
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Close
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Details
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
