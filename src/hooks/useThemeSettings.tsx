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

const DEFAULT_THEME_SETTINGS: ThemeSettings = {
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
};

export const useThemeSettings = () => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchThemeSettings = async () => {
    try {
      console.log('Fetching theme settings from Supabase...');
      
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*');

      if (error) {
        console.error('Error fetching theme settings:', error);
        // Используем настройки по умолчанию при ошибке
        setThemeSettings(DEFAULT_THEME_SETTINGS);
        applyThemeToDocument(DEFAULT_THEME_SETTINGS);
        setLoading(false);
        return;
      }

      console.log('Theme settings fetched successfully:', data);

      const settings = { ...DEFAULT_THEME_SETTINGS };
      
      // Обрабатываем полученные данные
      data?.forEach(item => {
        try {
          if (item.setting_name === 'colors' && item.setting_value) {
            settings.colors = { ...settings.colors, ...item.setting_value };
          } else if (item.setting_name === 'theme_mode' && item.setting_value?.mode) {
            settings.mode = item.setting_value.mode;
          } else if (item.setting_name === 'typography' && item.setting_value) {
            settings.typography = { ...settings.typography, ...item.setting_value };
          }
        } catch (parseError) {
          console.error('Error parsing theme setting:', item.setting_name, parseError);
        }
      });

      setThemeSettings(settings);
      applyThemeToDocument(settings);
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      // Используем настройки по умолчанию при ошибке
      setThemeSettings(DEFAULT_THEME_SETTINGS);
      applyThemeToDocument(DEFAULT_THEME_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const applyThemeToDocument = (settings: ThemeSettings) => {
    try {
      const root = document.documentElement;
      
      // Применяем цвета как CSS переменные
      root.style.setProperty('--primary', hexToHsl(settings.colors.primary));
      root.style.setProperty('--secondary', hexToHsl(settings.colors.secondary));
      root.style.setProperty('--accent', hexToHsl(settings.colors.accent));
      root.style.setProperty('--background', hexToHsl(settings.colors.background));
      root.style.setProperty('--foreground', hexToHsl(settings.colors.foreground));
      root.style.setProperty('--muted', hexToHsl(settings.colors.muted));
      root.style.setProperty('--border', hexToHsl(settings.colors.border));
      
      // Применяем брендовые цвета
      root.style.setProperty('--brand-pink', settings.colors.accent);
      
      // Применяем тему
      if (settings.mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Применяем типографику
      root.style.setProperty('--font-family', settings.typography.fontFamily);
      
      console.log('Theme applied to document successfully');
    } catch (error) {
      console.error('Error applying theme to document:', error);
    }
  };

  const hexToHsl = (hex: string): string => {
    try {
      // Простое преобразование hex в HSL для CSS переменных
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
    } catch (error) {
      console.error('Error converting hex to HSL:', hex, error);
      return '0 0% 50%'; // Возвращаем серый цвет по умолчанию
    }
  };

  const updateThemeSettings = async (newSettings: Partial<ThemeSettings>) => {
    try {
      console.log('Updating theme settings:', newSettings);
      
      const updatedSettings = { ...themeSettings, ...newSettings };
      
      // Обновляем цвета
      if (newSettings.colors) {
        console.log('Updating colors:', newSettings.colors);
        
        const { error: colorsError } = await supabase
          .from('theme_settings')
          .upsert({ 
            setting_name: 'colors', 
            setting_value: updatedSettings.colors 
          }, { 
            onConflict: 'setting_name',
            ignoreDuplicates: false 
          });

        if (colorsError) {
          console.error('Error updating colors:', colorsError);
          throw colorsError;
        }
      }

      // Обновляем режим темы
      if (newSettings.mode) {
        console.log('Updating theme mode:', newSettings.mode);
        
        const { error: modeError } = await supabase
          .from('theme_settings')
          .upsert({ 
            setting_name: 'theme_mode', 
            setting_value: { mode: updatedSettings.mode } 
          }, { 
            onConflict: 'setting_name',
            ignoreDuplicates: false 
          });

        if (modeError) {
          console.error('Error updating theme mode:', modeError);
          throw modeError;
        }
      }

      // Обновляем типографику
      if (newSettings.typography) {
        console.log('Updating typography:', newSettings.typography);
        
        const { error: typographyError } = await supabase
          .from('theme_settings')
          .upsert({ 
            setting_name: 'typography', 
            setting_value: updatedSettings.typography 
          }, { 
            onConflict: 'setting_name',
            ignoreDuplicates: false 
          });

        if (typographyError) {
          console.error('Error updating typography:', typographyError);
          throw typographyError;
        }
      }

      // Обновляем локальное состояние и применяем тему
      setThemeSettings(updatedSettings);
      applyThemeToDocument(updatedSettings);

      toast({
        title: "Успех",
        description: "Настройки темы успешно обновлены",
      });
      
      console.log('Theme settings updated successfully');
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

  // Инициализация темы при загрузке
  useEffect(() => {
    fetchThemeSettings();
  }, []);

  // Применяем тему при изменении настроек
  useEffect(() => {
    if (!loading) {
      applyThemeToDocument(themeSettings);
    }
  }, [themeSettings, loading]);

  return {
    themeSettings,
    loading,
    updateThemeSettings,
    refetch: fetchThemeSettings
  };
};