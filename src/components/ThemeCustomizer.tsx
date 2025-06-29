
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { Palette, RotateCcw } from 'lucide-react';

const ThemeCustomizer = () => {
  const { colors, updateColors, loading } = useTheme();
  const [tempColors, setTempColors] = useState(colors);

  const handleColorChange = (colorKey: string, value: string) => {
    setTempColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleSaveColors = async () => {
    await updateColors(tempColors);
  };

  const handleResetColors = () => {
    const defaultColors = {
      primary: '#0EA5E9',
      secondary: '#64748B',
      accent: '#EC4899',
      background: '#FFFFFF',
      foreground: '#1E293B',
      muted: '#F1F5F9',
      border: '#E2E8F0'
    };
    setTempColors(defaultColors);
  };

  if (loading) {
    return <div className="text-center p-8">Загрузка настроек темы...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Настройка цветовой схемы
        </CardTitle>
        <CardDescription>
          Измените основные цвета сайта. Изменения будут применены сразу после сохранения.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Основной цвет</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={tempColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={tempColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="flex-1"
                placeholder="#0EA5E9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Акцентный цвет</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={tempColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={tempColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="flex-1"
                placeholder="#EC4899"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Вторичный цвет</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={tempColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={tempColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="flex-1"
                placeholder="#64748B"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Цвет фона</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={tempColors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={tempColors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="flex-1"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Цвет текста</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={tempColors.foreground}
                onChange={(e) => handleColorChange('foreground', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={tempColors.foreground}
                onChange={(e) => handleColorChange('foreground', e.target.value)}
                className="flex-1"
                placeholder="#1E293B"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Цвет границ</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={tempColors.border}
                onChange={(e) => handleColorChange('border', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={tempColors.border}
                onChange={(e) => handleColorChange('border', e.target.value)}
                className="flex-1"
                placeholder="#E2E8F0"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSaveColors} className="flex-1">
            Сохранить изменения
          </Button>
          <Button variant="outline" onClick={handleResetColors}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Предварительный просмотр</h3>
          <div className="space-y-3">
            <div 
              className="p-3 rounded border"
              style={{ 
                backgroundColor: tempColors.background,
                borderColor: tempColors.border,
                color: tempColors.foreground
              }}
            >
              <h4 style={{ color: tempColors.primary }}>Основной заголовок</h4>
              <p style={{ color: tempColors.secondary }}>Вторичный текст</p>
              <button 
                className="px-4 py-2 rounded text-white mt-2"
                style={{ backgroundColor: tempColors.accent }}
              >
                Акцентная кнопка
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer;
