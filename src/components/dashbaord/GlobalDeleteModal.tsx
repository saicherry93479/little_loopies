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
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface DeleteDialogProps {
  row: any;
  onDelete: (row: any) => Promise<any>;
  // Optional props for customization
  title?: string;
  description?: string;
  triggerButton?: React.ReactNode;
}

const GlobalDeleteModal = ({
  row,
  onDelete,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete this record from the database.",
  triggerButton,
}: DeleteDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { toast } = useToast();
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const resp = await onDelete(row);
      console.log('resp is ',resp)
      if (resp.success) {
        toast({
          title: resp.message || "",
          description: "Successfully delted Product",
        });
      } else {
        toast({
          title: "There was a problem with your request.",
          description: resp.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {triggerButton || (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            {title}
          </DropdownMenuItem>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GlobalDeleteModal;
