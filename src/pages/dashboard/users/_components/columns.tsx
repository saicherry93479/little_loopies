import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import CopyText from "@/components/dashbaord/CopyText";

// Define User Role type with necessary fields
export type UserRole = {
  id: string;
  roleName: string;
  description: string;
  permissions: string[]; // Array of permission names or IDs
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive";
};

export const columns: ColumnDef<UserRole>[] = [
  {
    accessorKey: "id",
    header: "User ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground  flex items-center gap-2">
        <CopyText text={row.getValue("id")}></CopyText>
        <p className="max-w-[150px] truncate">{row.getValue("id")}</p>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "User Name",
    cell: ({ row }) => (
      <div className="font-medium text-primary">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "userType",
    header: "User Type",
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
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
      const role = row.original;

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
              onClick={() => navigator.clipboard.writeText(role.id)}
            >
              Copy Role ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Role</DropdownMenuItem>
            <DropdownMenuItem>Delete Role</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const filterFields = [""];
export const datePickers = ["updatedAt", "createdAt"];
