"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { actions } from "astro:actions";
import GlobalDeleteModal from "@/components/dashbaord/GlobalDeleteModal";
import { toast } from "sonner";
import StatusModal from "./StatusModal";
import StoreDetails from "./StoreDetails";
import { useState } from "react";

export const columns = (handleStatusUpdate: (storeId: string, newStatus: string) => void): ColumnDef<any>[] => {
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owner Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "storeName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Store Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center">email</div>,
    },
    {
      accessorKey: "mobile",
      header: () => <div className="text-center">Mobile</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row, table }) => {
        const status = row.getValue("status");
        const statusVariants = {
          active: "success",
          inactive: "destructive",
          pending: "warning",
          suspended: "destructive",
        };

        const onStatusUpdate = (newStatus: string) => {
          // Update the row data
          // row.original.status = newStatus;
          handleStatusUpdate(row.original.id, newStatus);
          // Force table refresh
        
        };

        return (
          <div className="flex items-center">
            <Badge variant={statusVariants[status as keyof typeof statusVariants]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <StatusModal 
              storeId={row.original.id}
              currentStatus={status}
              onStatusUpdate={onStatusUpdate}
            />
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Creted Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const store = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(store.id)}
              >
                Copy Store ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <StoreDetails store={store}>
                  <p>View Details</p>
                </StoreDetails>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <p onClick={async () => {
                  const res = await actions.sendStoreEmail({
                    id: store.id,
                    email: store.email,
                  });
                  if(res.data?.success){
                    toast.success(res.data?.message || "Email sent successfully")
                  }else{
                    toast.error(res.data?.message || "Email not sent,Please try again")
                  }
                }}>
                  Send Credentials
                </p>
              </DropdownMenuItem>

              <a href={`/dashboard/stores/${store.id}`}>
                <DropdownMenuItem>Edit Store</DropdownMenuItem>
              </a>
              
              <GlobalDeleteModal
                row={store}
                onDelete={async () => {
                  try {
                    const resp = await actions.deleteStore({
                      id: store.id,
                    });
                    if (resp.data?.success) {
                      return { success: true };
                    }
                  } catch (e) {
                    return { success: false, message: e.message };
                  }
                  return { success: false, message: "Something went wrong" };
                }}
                title="Delete Store"
                description={`Are you sure you want to delete ${store.storeName}?`}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export const filterFields = ["isWholesaleEnabled"];
