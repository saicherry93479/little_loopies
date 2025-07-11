import { create } from "zustand";
import { persist } from "zustand/middleware";
import { actions } from "astro:actions";

export interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await actions.login({ email, password });
          
          if (response.data.success) {
            // We don't need to set the user here as it will be set by the middleware
            // and available on the next page load
            set({ isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ 
              isAuthenticated: false, 
              isLoading: false, 
              error: response.data.message || "Login failed" 
            });
            return false;
          }
        } catch (error) {
          set({ 
            isAuthenticated: false, 
            isLoading: false, 
            error: "An unexpected error occurred" 
          });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await actions.logout({});
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: "Failed to logout" });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          // This would be a server-side check in a real implementation
          // For now, we'll just check if we have a user in the store
          const isAuth = !!get().user;
          set({ isAuthenticated: isAuth, isLoading: false });
          return isAuth;
        } catch (error) {
          set({ isAuthenticated: false, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);