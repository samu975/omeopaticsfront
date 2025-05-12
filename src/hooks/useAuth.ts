import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/models';
import { userService } from '@/services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      userService.getProfile()
        .then(user => {
          setUser(user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [router]);

  const login = async (cedula: string, password: string) => {
    try {
      const { token, user } = await userService.login(cedula, password);
      localStorage.setItem('token', token);
      setUser(user);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const register = async (userData: Partial<User>) => {
    try {
      const user = await userService.register(userData);
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };
} 