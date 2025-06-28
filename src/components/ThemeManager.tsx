import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useThemeSettings } from '@/hooks/useThemeSettings';

const ThemeManager = () => {
  const { themeSettings, loading, updateThemeSettings } = useThemeSettings();
  const [localSettings, setLocalSettings] = useState(themeSettings);

  const handleColorChange = (colorKey: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleModeChange = (isDark: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      mode: isDark ? 'dark' : 'light'
    }));
  };

  const handleTypographyChange = (key: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    await updateThemeSettings(localSettings);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      colors: {
        primary: '#0EA5E9',
        secondary: '#64748B',
        accent: '#EC4899',
        background: '#FFFFFF',
        foreground: '#1E293B',
        muted: '#F1F5F9',
        border: '#E2E8F0'
      },
      mode: 'light' as const,
      typography: {
        fontFamily: 'Inter',
        headingWeight: '600',
        bodyWeight: '400'
      }
    };
    setLocalSettings(defaultSettings);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Загрузка настроек темы...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Цветовая схема</CardTitle>
          <CardDescription>Настройте основные цвета сайта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Основной цвет</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localSettings.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={localSettings.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="#0EA5E9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Акцентный цвет</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localSettings.colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={localSettings.colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  placeholder="#EC4899"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Вторичный цвет</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localSettings.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={localSettings.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  placeholder="#64748B"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Фон</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localSettings.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={localSettings.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Текст</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localSettings.colors.foreground}
                  onChange={(e) => handleColorChange('foreground', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={localSettings.colors.foreground}
                  onChange={(e) => handleColorChange('foreground', e.target.value)}
                  placeholder="#1E293B"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Границы</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localSettings.colors.border}
                  onChange={(e) => handleColorChange('border', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={localSettings.colors.border}
                  onChange={(e) => handleColorChange('border', e.target.value)}
                  placeholder="#E2E8F0"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Режим темы</CardTitle>
          <CardDescription>Переключение между светлой и темной темой</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              checked={localSettings.mode === 'dark'}
              onCheckedChange={handleModeChange}
            />
            <Label>Темная тема</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Типографика</CardTitle>
          <CardDescription>Настройки шрифтов</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Семейство шрифтов</Label>
              <Select
                value={localSettings.typography.fontFamily}
                onValueChange={(value) => handleTypographyChange('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Толщина заголовков</Label>
              <Select
                value={localSettings.typography.headingWeight}
                onValueChange={(value) => handleTypographyChange('headingWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                  <SelectItem value="800">Extrabold (800)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Толщина основного текста</Label>
              <Select
                value={localSettings.typography.bodyWeight}
                onValueChange={(value) => handleTypographyChange('bodyWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light (300)</SelectItem>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave}>
          Сохранить настройки
        </Button>
        <Button variant="outline" onClick={resetToDefaults}>
          Сбросить к умолчанию
        </Button>
      </div>
    </div>
  );
};

export default ThemeManager;