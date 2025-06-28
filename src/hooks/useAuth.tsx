
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохраненную сессию при загрузке
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('is_admin', {
        user_email: email,
        user_password: password
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Ошибка при входе в систему' };
      }

      if (data) {
        setIsAuthenticated(true);
        localStorage.setItem('adminSession', JSON.stringify({ email, timestamp: Date.now() }));
        return { success: true };
      } else {
        return { success: false, error: 'Неверный логин или пароль' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ошибка при входе в систему' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminSession');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
