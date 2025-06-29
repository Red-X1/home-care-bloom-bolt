import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  updateColors: (colors: Partial<ThemeColors>) => Promise<boolean>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colors, setColors] = useState<ThemeColors>({
    primary: '#3B82F6',
    secondary: '#64748B',
    accent: '#EC4899',
    background: '#FFFFFF',
    foreground: '#1E293B',
    muted: '#F1F5F9',
    border: '#E2E8F0'
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*');

      if (error) throw error;

      data?.forEach(setting => {
        if (setting.setting_name === 'colors') {
          const colorData = setting.setting_value;
          if (colorData && typeof colorData === 'object' && !Array.isArray(colorData)) {
            setColors(colorData as unknown as ThemeColors);
          }
        } else if (setting.setting_name === 'theme_mode') {
          const modeData = setting.setting_value;
          if (modeData && typeof modeData === 'object' && 'mode' in modeData) {
            setIsDarkMode((modeData as any).mode === 'dark');
          }
        }
      });

      applyThemeToDocument();
    } catch (error) {
      console.error('Error fetching theme settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyThemeToDocument = () => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply custom colors
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-background', colors.background);
    root.style.setProperty('--theme-foreground', colors.foreground);
    root.style.setProperty('--theme-muted', colors.muted);
    root.style.setProperty('--theme-border', colors.border);
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    try {
      await supabase
        .from('theme_settings')
        .upsert({
          setting_name: 'theme_mode',
          setting_value: { mode: newMode ? 'dark' : 'light' } as any
        }, { onConflict: 'setting_name' });
    } catch (error) {
      console.error('Error updating theme mode:', error);
    }
  };

  const updateColors = async (newColors: Partial<ThemeColors>) => {
    try {
      const updatedColors = { ...colors, ...newColors };
      setColors(updatedColors);

      const { error } = await supabase
        .from('theme_settings')
        .upsert({
          setting_name: 'colors',
          setting_value: updatedColors as any
        }, { onConflict: 'setting_name' });

      if (error) throw error;

      applyThemeToDocument();
      return true;
    } catch (error) {
      console.error('Error updating colors:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  useEffect(() => {
    applyThemeToDocument();
  }, [colors, isDarkMode]);

  return (
    <ThemeContext.Provider value={{
      colors,
      isDarkMode,
      toggleDarkMode,
      updateColors,
      loading
    }}>
      {children}
    </ThemeContext.Provider>
  );
};