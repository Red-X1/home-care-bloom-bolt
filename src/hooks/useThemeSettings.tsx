import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

interface ThemeSettings {
  colors: ThemeColors;
  mode: 'light' | 'dark';
  typography: {
    fontFamily: string;
    headingWeight: string;
    bodyWeight: string;
  };
}

export const useThemeSettings = () => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    colors: {
      primary: '#0EA5E9',
      secondary: '#64748B',
      accent: '#EC4899',
      background: '#FFFFFF',
      foreground: '#1E293B',
      muted: '#F1F5F9',
      border: '#E2E8F0'
    },
    mode: 'light',
    typography: {
      fontFamily: 'Inter',
      headingWeight: '600',
      bodyWeight: '400'
    }
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*');

      if (error) {
        console.error('Error fetching theme settings:', error);
        setLoading(false);
        return;
      }

      const settings = { ...themeSettings };
      data?.forEach(item => {
        if (item.setting_name === 'colors') {
          settings.colors = { ...settings.colors, ...item.setting_value };
        } else if (item.setting_name === 'theme_mode') {
          settings.mode = item.setting_value.mode;
        } else if (item.setting_name === 'typography') {
          settings.typography = { ...settings.typography, ...item.setting_value };
        }
      });

      setThemeSettings(settings);
      applyThemeToDocument(settings);
    } catch (error) {
      console.error('Error fetching theme settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyThemeToDocument = (settings: ThemeSettings) => {
    const root = document.documentElement;
    
    // Apply colors as CSS variables
    root.style.setProperty('--primary', hexToHsl(settings.colors.primary));
    root.style.setProperty('--secondary', hexToHsl(settings.colors.secondary));
    root.style.setProperty('--accent', hexToHsl(settings.colors.accent));
    root.style.setProperty('--background', hexToHsl(settings.colors.background));
    root.style.setProperty('--foreground', hexToHsl(settings.colors.foreground));
    root.style.setProperty('--muted', hexToHsl(settings.colors.muted));
    root.style.setProperty('--border', hexToHsl(settings.colors.border));
    
    // Apply brand colors
    root.style.setProperty('--brand-pink', settings.colors.accent);
    
    // Apply theme mode
    if (settings.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply typography
    root.style.setProperty('--font-family', settings.typography.fontFamily);
  };

  const hexToHsl = (hex: string): string => {
    // Simple hex to HSL conversion for CSS variables
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const updateThemeSettings = async (newSettings: Partial<ThemeSettings>) => {
    try {
      const updatedSettings = { ...themeSettings, ...newSettings };
      
      // Update colors
      if (newSettings.colors) {
        await supabase
          .from('theme_settings')
          .upsert({ 
            setting_name: 'colors', 
            setting_value: updatedSettings.colors 
          }, { onConflict: 'setting_name' });
      }

      // Update theme mode
      if (newSettings.mode) {
        await supabase
          .from('theme_settings')
          .upsert({ 
            setting_name: 'theme_mode', 
            setting_value: { mode: updatedSettings.mode } 
          }, { onConflict: 'setting_name' });
      }

      // Update typography
      if (newSettings.typography) {
        await supabase
          .from('theme_settings')
          .upsert({ 
            setting_name: 'typography', 
            setting_value: updatedSettings.typography 
          }, { onConflict: 'setting_name' });
      }

      setThemeSettings(updatedSettings);
      applyThemeToDocument(updatedSettings);

      toast({
        title: "Успех",
        description: "Настройки темы успешно обновлены",
      });
      return true;
    } catch (error) {
      console.error('Error updating theme settings:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки темы",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  return {
    themeSettings,
    loading,
    updateThemeSettings,
    refetch: fetchThemeSettings
  };
};