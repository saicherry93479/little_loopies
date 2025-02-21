import { useState } from "react";
import { NavLinks } from "./NavLinks";
import { TopBar } from "./TopBar";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white">
      {/* Top black banner */}
      <TopBar />

      {/* Main navbar */}
      <nav className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a href="/" className="w-[198px]">
            <h1 className="text-3xl font-bold">LITTLE LOOPIES</h1>
            {/* <img 
              src="/nordstrom-logo.svg" 
              alt="Nordstrom" 
              className="h-6 md:h-8"
            /> */}
          </a>

          {/* Search bar */}
          <SearchBar />

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <span>Sign In</span>
            </button>
            <button className="relative">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <NavLinks />
      </nav>
    </header>
  );
}
