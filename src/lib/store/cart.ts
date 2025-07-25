import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        // Check if user is authenticated for checkout
        const { isAuthenticated } = useAuthStore.getState();
        
        if (!isAuthenticated) {
          // Store the item temporarily but prompt login for checkout
          set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            
            if (existingItem) {
              return {
                items: state.items.map((i) => 
                  i.id === item.id 
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                ),
              };
            }
            
            return { items: [...state.items, item] };
          });
          return;
        }
        
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            return {
              items: state.items.map((i) => 
                i.id === item.id 
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return { items: [...state.items, item] };
        });
      },
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity, 
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);