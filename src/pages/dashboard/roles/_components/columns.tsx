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
    accessorKey: "name",
    header: "Role Name",
    cell: ({ row }) => (
      <div className="font-medium text-primary">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "rolePermissions",
    header: "Permissions",
    cell: ({ row }) => {
      const rolePermissions = row.getValue("rolePermissions") as string[];
      console.log("rolePermissions ", rolePermissions);
      return (
        <div className="flex flex-wrap gap-2">
          {rolePermissions.map((perm) => (
            <Badge key={perm} variant="outline" className="text-xs">
              {perm.permission.name}
            </Badge>
          ))}
        </div>
      );
    },
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
            <a href={`/dashboard/roles/${role.id}`}>
            <DropdownMenuItem>Edit Role</DropdownMenuItem>
            </a>
            <DropdownMenuItem>Delete Role</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const filterFields = [];
export const datePickers = ["updatedAt", "createdAt"];
