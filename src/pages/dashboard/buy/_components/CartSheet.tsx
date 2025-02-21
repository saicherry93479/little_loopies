// components/CartSheet.tsx
import React from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { actions } from "astro:actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "./cart";

export default function CartSheet() {
  const { items, removeItem, updateQuantity, getTotalAmount, clearCart } = useCartStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOrdering, setIsOrdering] = React.useState(false);
  const { toast } = useToast();
  
  const handlePlaceOrder = async () => {
    try {
      setIsOrdering(true);
      const orderItems = items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));

      const resp = await actions.createOrder({
        totalAmount: getTotalAmount(),
        userType: "store",
        orderItems,
      });

      if (resp.data.success) {
        toast({
          title: "Order Successful",
          description: resp.data.message,
        });
        clearCart();
        setIsOpen(false);
      } else {
        toast({
          title: "Order Failed",
          description: resp.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Review your items before placing the order
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[65vh] my-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-16 w-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{item.unitPrice} × {item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.productId, item.quantity - item.selectedTier.quantity)}
                      disabled={item.quantity <= item.selectedTier.quantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.productId, item.quantity + item.selectedTier.quantity)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.totalPrice}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="w-full space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold">₹{getTotalAmount()}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handlePlaceOrder}
              disabled={isOrdering || items.length === 0}
            >
              {isOrdering ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}