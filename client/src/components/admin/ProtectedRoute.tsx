import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation("/admin");
      } else if (!isAdmin) {
        setLocation("/");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground">Carregando...</div>
    </div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;