import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  fallback = <div className="p-8 text-center">Please log in to view this content</div>,
  requireAuth = true 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    
    verify();
  }, [checkAuth]);

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-4">
        {fallback}
        <a 
          href="/auth/login" 
          className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Login
        </a>
      </div>
    );
  }

  return <>{children}</>;
}