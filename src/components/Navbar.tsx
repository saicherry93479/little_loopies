import { useState } from "react";
import { NavLinks } from "./NavLinks";
import { TopBar } from "./TopBar";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { ShoppingBag, Heart } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      {/* Top black banner */}
      <TopBar />

      {/* Main navbar */}
      <nav className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a href="/" className="w-[198px]">
            <h1 className="text-3xl font-bold">LITTLE LOOPIES</h1>
          </a>

          {/* Search bar */}
          <SearchBar />

          {/* Right side icons */}
          <div className="flex items-center gap-6">
            <UserMenu />
            <a href="/cart" className="relative text-gray-800 hover:text-gray-600" >
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            </a>
            <a href="/wishlist" className="relative text-gray-800 hover:text-gray-600" >
              <Heart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistItemsCount}
              </span>
            </a>
          </div>
        </div>

        {/* Navigation links */}
        <NavLinks />
      </nav>
    </header>
  );
}
