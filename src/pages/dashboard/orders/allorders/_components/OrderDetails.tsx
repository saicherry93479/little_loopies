"use client";

import { useState, useRef, useEffect } from "react";
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
import { Download } from "lucide-react";

interface OrderDetailsSheetProps {
  order?: {
    id: string;
    customerName: string;
    orderDate: string;
    total: number;
    status: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    shippingAddress: string;
    trackingNumber?: string;
  };
  children: React.ReactNode;
}

export default function OrderDetails({
  order,
  children,
}: OrderDetailsSheetProps) {
  console.log("order in OrderDetails.tsx ", JSON.parse(order?.orderItems));
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleExport = () => {
    // Implement export functionality here
    console.log("Exporting order details...");
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
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          {children}
        </div>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[calc(100vw-2rem)]">
        <SheetHeader>
          <SheetTitle>Order Details - #{order?.orderId}</SheetTitle>
          <SheetDescription>
            View complete information about this order.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Order Information</h3>
            <Separator className="my-2" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Customer:</dt>
                <dd>{order?.userName}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Email:</dt>
                <dd>{order?.userEmail}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Mobile:</dt>
                <dd>{order?.userMobile}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Date:</dt>
                {/* <dd>{new date(order?.orderCreatedAt)}</dd> */}
              </div>
              <div className="flex justify-between">
                <dt>Total:</dt>
                <dd>₹{order?.totalAmount?.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Status:</dt>
                <dd className="font-medium text-green-600">
                  {order?.orderStatus}
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-medium">Order Items</h3>
            <Separator className="my-2" />
            <ul className="space-y-2">
              {JSON.parse(order?.orderItems)?.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>₹{(item.totalPrice * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium">Shipment Details</h3>
            <Separator className="my-2" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Shipping Address:</dt>
                <dd className="text-right">
                  {(() => {
                    try {
                      const address = JSON.parse(order?.shippingAddress);
                      return (
                        <>
                          {address?.street},{address?.city},{address?.state}
                          <br />
                          {address?.pincode}
                        </>
                      );
                    } catch (e) {
                      return order?.shippingAddress || "N/A";
                    }
                  })()}
                </dd>{" "}
              </div>
              {order?.trackingNumber && (
                <div className="flex justify-between">
                  <dt>Tracking Number:</dt>
                  <dd>{order?.trackingNumber}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
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
