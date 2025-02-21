"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenSquare, Search, X, AlertCircle } from "lucide-react";
import { actions } from "astro:actions";

interface Store {
  id: string;
  name: string;
  city: string;
  pincode: string;
}

export default function StoreAssignModal({
  children,
  orderId,
  isCompanyAssigned = true,
}) {
  const [stores, setStores] = useState<Store[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setError(null);
        const result = await actions.getEligibleStoresAction({ orderId });

        if (result.data.success) {
          setStores(result.data.data || []);
        } else {
          setError(result.data.message || "Failed to fetch stores");
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        setError("Unable to load stores. Please try again.");
      }
    };

    if (open) {
      fetchStores();
    }
  }, [orderId, open]);

  const filteredStores = stores.filter((store) =>
    Object.values(store).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAssign = async () => {
    if (selectedStore) {
      setIsLoading(true);
      setError(null);
      try {
        const result = await actions.assignOrderToStoreAction({
          orderId,
        });

        if (result.data.success) {
          setOpen(false);
          setSelectedStore(null);
        } else {
          setError(result.data.message || "Failed to assign store");
        }
      } catch (error) {
        console.error("Error assigning to store:", error);
        setError("Failed to assign store. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAssignToCompany = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await actions.assignOrderToCompanyAction({ orderId });

      if (result.data.success) {
        setOpen(false);
        setSelectedStore(null);
      } else {
        setError(result.data.message || "Failed to assign to company");
      }
    } catch (error) {
      console.error("Error assigning to company:", error);
      setError("Failed to assign to company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(selectedStore?.id === store.id ? null : store);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-transparent hover:bg-transparent text-zinc-800"
      >
        {children}
        <PenSquare className="size-4 cursor-pointer" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {error && (
            <div className="flex items-center bg-red-50 p-3 rounded-md text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {stores.length > 0 ? (
            <>
              <DialogHeader>
                <DialogTitle>Assign to Store or Company</DialogTitle>
              </DialogHeader>

              {selectedStore && (
                <div className="flex items-center justify-between bg-muted p-2 rounded-md mb-4">
                  <span>Selected: {selectedStore.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedStore(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Store ID</TableHead>
                      <TableHead>Store Name</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.map((store) => (
                      <TableRow
                        key={store.id}
                        className={
                          selectedStore?.id === store.id ? "bg-muted/50" : ""
                        }
                      >
                        <TableCell>{store.id}</TableCell>
                        <TableCell>{store.name}</TableCell>
                        <TableCell>{store.city}</TableCell>
                        <TableCell>{store.pincode}</TableCell>
                        <TableCell>
                          <Button
                            variant={
                              selectedStore?.id === store.id
                                ? "destructive"
                                : "ghost"
                            }
                            size="sm"
                            onClick={() => handleSelectStore(store)}
                          >
                            {selectedStore?.id === store.id
                              ? "Unselect"
                              : "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setSelectedStore(null);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignToCompany}
                  disabled={isLoading || isCompanyAssigned}
                >
                  {isLoading ? "Assigning..." : "Assign to Company"}
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedStore || isLoading}
                >
                  {isLoading ? "Assigning..." : "Assign to Store"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-600">
                No stores available for assignment
              </p>
              <p className="text-sm text-gray-500 mt-2 mb-4">
                Please contact support or check your order details
              </p>
              {!isCompanyAssigned && (
                <Button
                  onClick={handleAssignToCompany}
                  disabled={isLoading}
                  className="mt-2"
                >
                  {isLoading ? "Assigning..." : "Assign to Company"}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
