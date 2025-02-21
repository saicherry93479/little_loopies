"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, PenSquare } from "lucide-react";
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
import GlobalDeleteModal from "@/components/dashbaord/GlobalDeleteModal";
import { actions } from "astro:actions";
import OrderDetails from "./OrderDetails";
import { Pen } from "lucide-react";
import StatusModal from "./StatusModal";
import OrderStatusModal from "./OrderStatusModal";

export const columns = (
  updateOrderStatus,
  writeAccess = false
): ColumnDef<any>[] => {
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
      accessorKey: "orderId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return <p>{row.original.orderId}</p>;
      },
    },
    {
      accessorKey: "storeName",
      header: "Store Name",
      cell: ({ row }) => {
        return (
          <p>
            {row.original.storeName}
            {/* {row.getValue('store').name} */}
          </p>
        );
      },
    },
    {
      accessorKey: "ownerName",
      header: "Owner Name",
      cell: ({ row }) => {
        return (
          <p>
            {row.original.ownerName}
            {/* {row.getValue('store').name} */}
          </p>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            {writeAccess ? (
              <OrderStatusModal
                currentStatus={row.getValue("status")}
                orderId={row.getValue("orderId")}
                updateOrderStatus={updateOrderStatus}
              ></OrderStatusModal>
            ) : (
              <p>{row.getValue("status")}</p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: () => <div className="text-right">Total Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.original.totalAmount);
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ordered Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "expectedDeliveryDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.expectedDeliveryDate);
        return (
          <div className="flex gap-2 items-center justify-center">
            <p className="">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
           
            {writeAccess ? (
              <PenSquare className="size-4 cursor-pointer"></PenSquare>
              ) : <></>}
          </div>
        );
      },
    },
    {
      id: "view",
      cell: ({ row }) => (
        <OrderDetails>
          <Button>View</Button>
        </OrderDetails>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <OrderDetails>
                  <p>View Details</p>
                </OrderDetails>
              </DropdownMenuItem>
              
            
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export const filterFields = ["status", "storeName"];
