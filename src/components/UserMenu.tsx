import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, ShoppingBag, Heart, UserCircle } from "lucide-react";

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check authentication status on mount
    if (mounted) {
      useAuthStore.getState().checkAuth();
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!isAuthenticated) {
    return (
      <a href="/auth/login" className="flex items-center gap-2 text-gray-800 hover:text-gray-600">
        <UserCircle className="w-5 h-5" />
        <span className="hidden md:inline">Sign In</span>
      </a>
    );
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:inline">{user?.name || "User"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href="/account" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>My Account</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/orders" className="cursor-pointer">
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/wishlist" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}