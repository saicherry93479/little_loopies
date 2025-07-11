import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  brand?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        // Check if user is authenticated
        const { isAuthenticated } = useAuthStore.getState();
        
        if (!isAuthenticated) {
          // Redirect to login if not authenticated
          window.location.href = `/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
          return;
        }
        
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            return state;
          }
          
          return { items: [...state.items, item] };
        });
      },
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
);