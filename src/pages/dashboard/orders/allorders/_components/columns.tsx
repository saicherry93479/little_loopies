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
import OrderDetails from "./OrderDetails";
import StoreAssignModal from "./StoreAssignModal";
import OrderStatusModal from "./OrderStatusModal";
import CopyText from "@/components/dashbaord/CopyText";

export const columns: ColumnDef<any>[] = (
  writeAccess: boolean = false,
  updateOrderStatus = () => {}
) => {
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <p>{row.getValue("orderId")}</p>
          <CopyText text={row.getValue("orderId")}></CopyText>
        </div>
      ),
    },
    {
      accessorKey: "orderAssignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        return writeAccess ? (
          <StoreAssignModal orderId={row.getValue("orderId")}>
            <p>{row.getValue("orderAssignedTo")}</p>
          </StoreAssignModal>
        ) : (
          <p>{row.getValue("orderAssignedTo")}</p>
        );
      },
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      // cell: ({ row }) => {
      //  return  <Button className="bg-transparent hover:bg-transparent text-zinc-800">
      //     {row.getValue("orderStatus")}
      //     <PenSquare className="size-4 cursor-pointer" />
      //   </Button>;
      // },
      cell: ({ row }) => {
        return writeAccess ? (
          <OrderStatusModal
            currentStatus={row.getValue("orderStatus")}
            orderId={row.getValue("orderId")}
            updateOrderStatus={updateOrderStatus}
          ></OrderStatusModal>
        ) : (
          <p>{row.getValue("orderStatus")}</p>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "Name",
    },
    {
      accessorKey: "userEmail",
      header: "Email",
    },
    {
      accessorKey: "userMobile",
      header: "Mobile",
    },

    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ordered On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.orderCreatedAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      id: "view",
      cell: ({ row }) => (
        <OrderDetails order={row.original}>
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
                <OrderDetails order={row.original}>
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

export const filterFields = ["orderStatus", "orderAssignedTo"];
