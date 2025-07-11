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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Store,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  CircleDollarSign,
} from "lucide-react";

interface StoreDetailsProps {
  store: {
    id: string;
    name: string;
    storeName: string;
    email: string;
    mobile: string;
    status: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstNumber?: string;
    panNumber?: string;
    storeType: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
  children: React.ReactNode;
}

export default function StoreDetails({ store, children }: StoreDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const statusVariants = {
    active: "success",
    inactive: "destructive",
    pending: "warning",
    suspended: "destructive",
  };

  const handleExport = () => {
    const csvContent = `
Store Details
-------------
ID: ${store.id}
Store Name: ${store.storeName}
Owner Name: ${store.name}
Email: ${store.email}
Mobile: ${store.mobile}
Status: ${store.status}
Address: ${store.address}
City: ${store.city}
State: ${store.state}
PIN: ${store.pincode}
GST Number: ${store.gstNumber || 'N/A'}
PAN Number: ${store.panNumber || 'N/A'}
Store Type: ${store.storeType}
Created At: ${new Date(store.createdAt).toLocaleDateString()}
Updated At: ${new Date(store.updatedAt).toLocaleDateString()}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store-${store.id}-details.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

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
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[calc(100vw-2rem)]">
        <SheetHeader>
          <SheetTitle>Store Details</SheetTitle>
          <SheetDescription>
            Complete information about this store
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="mt-6 space-y-6">
            {/* Basic Store Information */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </h3>
              <Separator className="my-2" />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{store.storeName}</span>
                  <Badge variant={statusVariants[store.status as keyof typeof statusVariants]}>
                    {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                  </Badge>
                </div>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Owner: {store.name}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {store.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {store.mobile}
                </p>
              </div>
            </div>

            {/* Store Address */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Store Address
              </h3>
              <Separator className="my-2" />
              <div className="space-y-1">
                <p>{store.address}</p>
                <p>{store.city}, {store.state}</p>
                <p>PIN: {store.pincode}</p>
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Details
              </h3>
              <Separator className="my-2" />
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4" />
                  Store Type: {store.storeType}
                </p>
                {store.gstNumber && (
                  <p>GST Number: {store.gstNumber}</p>
                )}
                {store.panNumber && (
                  <p>PAN Number: {store.panNumber}</p>
                )}
              </div>
            </div>

            {/* Registration Details */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Registration Details
              </h3>
              <Separator className="my-2" />
              <div className="space-y-2">
                <p>Created: {new Date(store.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(store.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="flex justify-between">
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Close
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Details
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}