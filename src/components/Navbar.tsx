import { useState } from "react";
import { NavLinks } from "./NavLinks";
import { TopBar } from "./TopBar";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);

  return (
    <header className="w-full bg-white sticky top-0 z-50">
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
          <div className="flex items-center gap-4">
            <UserMenu />
            <a href="/cart" className="relative" >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            </a>
            <a href="/wishlist" className="relative" >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
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
