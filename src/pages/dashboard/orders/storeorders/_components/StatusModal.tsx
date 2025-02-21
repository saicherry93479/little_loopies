import React from "react";
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
import { useToast } from "@/hooks/use-toast";
import { PenSquare } from "lucide-react";

const StatusModal = ({ updateOrderStatus, orderId, currentStatus }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUpdating, setisUpdating] = React.useState(false);

  const handleUpdate = async () => {
    updateOrderStatus(orderId, "FINISHED");
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <PenSquare className="size-4 cursor-pointer"></PenSquare>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Update Status</AlertDialogTitle>
          <AlertDialogDescription>
            You can update status of item
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-zinc-900 hover:bg-zinc-700 focus:ring-zinc-600"
          >
            {isUpdating ? "Processing..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusModal;
