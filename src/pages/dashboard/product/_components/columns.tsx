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
import OrderDetails from "../../orders/allorders/_components/OrderDetails";
import ProductDetails from "./ProductDetails";
import { actions } from "astro:actions";
import GlobalDeleteModal from "@/components/dashbaord/GlobalDeleteModal";
import { toast } from "sonner";

export const columns = (
  removeProduct,
  isStoreUser = false
): ColumnDef<any>[] => {
  // Base columns for store users
  const storeColumns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "totalStock",
      header: "Current Stock",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("totalStock")}</div>
      ),
    },
    {
      accessorKey: "totalQuantityOrdered",
      header: "Ordered Quantity",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("totalQuantityOrdered")}</div>
      ),
    },
    {
      accessorKey: "averageStorePrice",
      header: "Store Price Average",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          ₹{row.getValue("averageStorePrice")}
        </div>
      ),
    },
    {
      accessorKey: "companyPrice",
      header: "User Price",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          ₹{row.getValue("companyPrice")}
        </div>
      ),
    },
    {
      accessorKey: "locationCount",
      header: "Delivered Count from company",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("locationCount")}
        </div>
      ),
    }
  ];

  const adminColumns = [
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
          name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "userPrice",
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("userPrice")}
          </div>
        );
      },
    },
    {
      accessorKey: "userDiscountPercentage",
      header: () => <div className="text-right">Discount</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right text-muted-foreground">
            {row.getValue("userDiscountPercentage")}
          </div>
        );
      },
    },

    {
      accessorKey: "isWholesaleEnabled",
      header: "Is Wholesale Enabled",
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) => {
        const categories = row.getValue("categories") || [];
        const displayCount = Math.min(2, categories.length);
        const remainingCount = categories.length - displayCount;

        return (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, displayCount).map((category, index) => (
              <Badge key={index} variant="secondary">
                {category.categoryId}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline">+{remainingCount}</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "activeForUsers",
      header: "User Purchase",
    },
    {
      accessorKey: "items",
      header: () => <div className="text-right">Total Orders</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("items")?.length || 0}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "wholesalePriceTiers",
      header: "Wholesale Tiers",
      cell: ({ row }) => {
        const tiers = row.original.wholesalePriceTiers || [];
        const displayCount = Math.min(2, tiers.length);
        const remainingCount = tiers.length - displayCount;

        return (
          <div className="flex flex-wrap gap-1">
            {tiers.slice(0, displayCount).map((tier, index) => (
              <Badge key={index} variant="secondary">
                {tier.quantity} - {tier.pricePerUnit}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline">+{remainingCount}</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        // console.log('row is ',product)
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
                onClick={() => navigator.clipboard.writeText(product.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ProductDetails product={row.original}>
                  <p>View Deatils</p>
                </ProductDetails>
              </DropdownMenuItem>

              <a href={`/dashboard/product/${product.id}`}>
                <DropdownMenuItem>Edit Product</DropdownMenuItem>
              </a>
              {product?.items.length === 0 && (
                <GlobalDeleteModal
                  row={row.original}
                  onDelete={async () => {
                    try {
                      const resp = await actions.deleteProduct({
                        id: row.original.id,
                      });
                      console.log("resp from action ", resp);
                      if (resp.data?.success) {
                        await removeProduct(row.original.id);
                        return { success: true };
                      }
                    } catch (e) {
                      console.log("e is ", e);
                      return { success: false, message: e.message };
                    }
                    return { success: false, message: "someting went wrong" };
                  }}
                  // Optional: Customize messages
                  title="Delete Product"
                  description={`Are you sure you want to delete ${row.original.name}?`}
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return isStoreUser ? storeColumns : [...adminColumns];
};

export const getFilterFields = (isStoreUser: boolean) => 
  isStoreUser ? ["categories"] : ["isWholesaleEnabled", "activeForUsers", "categories"];

export const getDatePickers = (isStoreUser: boolean) =>
  isStoreUser ? [] : ["updatedAt"];
