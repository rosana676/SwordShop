import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export function useAuth() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setLocation('/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    logout,
  };
}
