// components/OrderModal.tsx
import React from "react";
import { ShoppingCart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "./cart";


const OrderModal = ({ product }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState(null);
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedTier) {
      toast({
        title: "Select Quantity",
        description: "Please select a quantity tier before adding to cart",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      quantity: selectedTier.quantity,
      unitPrice: selectedTier.pricePerUnit,
      totalPrice: selectedTier.quantity * selectedTier.pricePerUnit,
      selectedTier,
      image: product.images[0],
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full flex items-center">
          <ShoppingCart className="mr-2" />
          Add to Cart
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px] space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Add to Cart</AlertDialogTitle>
          <AlertDialogDescription>
            Please select quantity before adding to cart
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3">
          <Select
            onValueChange={(value) => 
              setSelectedTier(product.wholesalePriceTiers.find(t => 
                `${t.quantity}-${t.pricePerUnit}` === value
              ))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Quantity" />
            </SelectTrigger>
            <SelectContent>
              {product.wholesalePriceTiers.map((tier, index) => (
                <SelectItem 
                  key={index} 
                  value={`${tier.quantity}-${tier.pricePerUnit}`}
                >
                  ₹{tier.pricePerUnit} per piece - {tier.quantity} qty
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleAddToCart}
            className="w-full"
          >
            <ShoppingCart className="mr-2" />
            Add to Cart
          </Button>
          <AlertDialogCancel className="w-full">
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderModal;