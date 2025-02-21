import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, PenSquare } from "lucide-react";
import { actions } from "astro:actions";

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "processing", label: "Processing", color: "bg-blue-500" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500" },
  { value: "delivered", label: "Delivered", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
  { value: "ordered", label: "Ordered", color: "bg-red-500" },
];

export default function OrderStatusModal({
  currentStatus,
  orderId,
  updateOrderStatus,
}) {
  const [status, setStatus] = useState(currentStatus);
  const [open, setOpen] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState(currentStatus);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setError(null);
        const result = await actions.getOrderStatusHistory({
          orderId,
        });

        if (result.data.success) {
          console.log("result.data.orderHistory ", result.data.orderHistory);
          setStatusHistory(result.data.orderHistory || []);
        } else {
          setError(result.data.message || "Failed to fetch history");
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        setError("Unable to load stores. Please try again.");
      }
    };

    if (open) {
      fetchOrderHistory();
    }
  }, [orderId, open]);

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    try {
      const resp = await actions.updateOrderStatus({
        orderId,
        status,
      });
      console.log("resp in handleStatusUpdate ", resp);
      if (resp.data.success) {
        setCurrentState(status);
        const newStatusHistory = [
          { status, createdAt: new Date().getTime() },
          ...statusHistory,
        ];
        console.log("newStatusHistory ", newStatusHistory);
        setStatusHistory(newStatusHistory);
        updateOrderStatus(orderId, status);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-transparent hover:bg-transparent text-zinc-800"
      >
        {currentStatus}
        <PenSquare className="size-4 cursor-pointer" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {error && (
            <div className="flex items-center bg-red-50 p-3 rounded-md text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>Edit Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Update Status</Label>
              <Select onValueChange={setStatus} defaultValue={status}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleStatusUpdate}
              disabled={currentState === status || isLoading}
            >
              {isLoading ? "updating..." : "Update Status"}
            </Button>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Status History ({statusHistory.length} updates)
              </h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="relative">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  {statusHistory.map((item, index) => {
                    const statusOption = statusOptions.find(
                      (option) => option.value === item.status
                    );
                    return (
                      <div key={index} className="mb-4 relative">
                        <div
                          className={`absolute left-0 w-4 h-4 rounded-full ${statusOption?.color} border-2 border-white`}
                        ></div>
                        <div className="ml-8">
                          <p className="font-medium">{statusOption?.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.createdAt).toDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
