
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Save, X, Plus, GripVertical } from 'lucide-react';
import { useDynamicSections } from '@/hooks/useDynamicSections';
import ImageUpload from '@/components/ImageUpload';

interface DynamicSectionEditorProps {
  section: any;
  onClose: () => void;
}

const DynamicSectionEditor = ({ section, onClose }: DynamicSectionEditorProps) => {
  const { updateSection, createItem, updateItem, deleteItem, refetch } = useDynamicSections();
  const [editingSection, setEditingSection] = useState({
    title: section.title,
    subtitle: section.subtitle || '',
    description: section.description || '',
    background_color: section.background_color,
    text_color: section.text_color,
    font_family: section.font_family,
    font_weight: section.font_weight,
    font_size: section.font_size,
    is_visible: section.is_visible
  });

  const [sectionItems, setSectionItems] = useState(section.items || []);

  // Update local items when section items change
  useEffect(() => {
    setSectionItems(section.items || []);
  }, [section.items]);

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' }
  ];

  const fontWeightOptions = [
    { value: '300', label: 'Легкий' },
    { value: '400', label: 'Обычный' },
    { value: '500', label: 'Средний' },
    { value: '600', label: 'Полужирный' },
    { value: '700', label: 'Жирный' },
    { value: '800', label: 'Очень жирный' }
  ];

  const fontSizeOptions = [
    { value: 'xs', label: 'Очень маленький' },
    { value: 'sm', label: 'Маленький' },
    { value: 'base', label: 'Базовый' },
    { value: 'lg', label: 'Большой' },
    { value: 'xl', label: 'Очень большой' },
    { value: '2xl', label: '2X Большой' },
    { value: '3xl', label: '3X Большой' },
    { value: '4xl', label: '4X Большой' }
  ];

  const handleSave = async () => {
    await updateSection(section.id, editingSection);
    onClose();
  };

  const handleAddItem = async (itemType: string) => {
    const defaultContent = {
      text: { text: 'Новый текст' },
      image: { url: '', alt: 'Изображение' },
      button: { text: 'Кнопка', link: '#' },
      link: { text: 'Ссылка', url: '#' }
    };

    const newItem = {
      section_id: section.id,
      item_type: itemType,
      content: defaultContent[itemType as keyof typeof defaultContent] || {},
      text_color: '#000000',
      font_family: 'Inter',
      font_weight: '400',
      font_size: 'base',
      position_order: sectionItems.length
    };

    // Add item to database
    const createdItem = await createItem(newItem);
    
    if (createdItem) {
      // Update local state immediately for real-time UI
      setSectionItems(prev => [...prev, {
        ...createdItem,
        content: defaultContent[itemType as keyof typeof defaultContent] || {}
      }]);
    }
  };

  const handleUpdateItem = async (itemId: number, updates: any) => {
    const success = await updateItem(itemId, updates);
    if (success) {
      // Update local state immediately
      setSectionItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ));
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const success = await deleteItem(itemId);
    if (success) {
      // Update local state immediately
      setSectionItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const renderItemEditor = (item: any) => {
    const [itemContent, setItemContent] = useState(item.content);
    const [itemStyle, setItemStyle] = useState({
      text_color: item.text_color,
      font_family: item.font_family,
      font_weight: item.font_weight,
      font_size: item.font_size
    });

    const saveItem = async () => {
      await handleUpdateItem(item.id, {
        content: itemContent,
        ...itemStyle
      });
    };

    const updateLocalContent = (newContent: any) => {
      setItemContent(newContent);
      // Also update the local state immediately
      setSectionItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, content: newContent } : i
      ));
    };

    return (
      <Card key={item.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm capitalize">{
              item.item_type === 'text' ? 'Текст' :
              item.item_type === 'image' ? 'Изображение' :
              item.item_type === 'button' ? 'Кнопка' :
              item.item_type === 'link' ? 'Ссылка' : item.item_type
            }</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveItem}>
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content Editor */}
          {item.item_type === 'text' && (
            <div className="space-y-2">
              <Label>Текст</Label>
              <Textarea
                value={itemContent.text || ''}
                onChange={(e) => updateLocalContent({ ...itemContent, text: e.target.value })}
                rows={3}
              />
            </div>
          )}

          {item.item_type === 'image' && (
            <ImageUpload
              currentImage={itemContent.url || ''}
              onImageChange={(url) => updateLocalContent({ ...itemContent, url })}
              label="Изображение"
            />
          )}

          {item.item_type === 'button' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Текст кнопки</Label>
                <Input
                  value={itemContent.text || ''}
                  onChange={(e) => updateLocalContent({ ...itemContent, text: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ссылка</Label>
                <Input
                  value={itemContent.link || ''}
                  onChange={(e) => updateLocalContent({ ...itemContent, link: e.target.value })}
                />
              </div>
            </div>
          )}

          {item.item_type === 'link' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Текст ссылки</Label>
                <Input
                  value={itemContent.text || ''}
                  onChange={(e) => updateLocalContent({ ...itemContent, text: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={itemContent.url || ''}
                  onChange={(e) => updateLocalContent({ ...itemContent, url: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Style Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Цвет текста</Label>
              <Input
                type="color"
                value={itemStyle.text_color}
                onChange={(e) => setItemStyle({ ...itemStyle, text_color: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Шрифт</Label>
              <select
                value={itemStyle.font_family}
                onChange={(e) => setItemStyle({ ...itemStyle, font_family: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Толщина</Label>
              <select
                value={itemStyle.font_weight}
                onChange={(e) => setItemStyle({ ...itemStyle, font_weight: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {fontWeightOptions.map(weight => (
                  <option key={weight.value} value={weight.value}>{weight.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Размер</Label>
              <select
                value={itemStyle.font_size}
                onChange={(e) => setItemStyle({ ...itemStyle, font_size: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {fontSizeOptions.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Редактировать раздел</h2>
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Закрыть
          </Button>
        </div>
      </div>

      {/* Section Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки раздела</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Заголовок</Label>
              <Input
                value={editingSection.title}
                onChange={(e) => setEditingSection(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Подзаголовок</Label>
              <Input
                value={editingSection.subtitle}
                onChange={(e) => setEditingSection(prev => ({ ...prev, subtitle: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea
              value={editingSection.description}
              onChange={(e) => setEditingSection(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Цвет фона</Label>
              <Input
                type="color"
                value={editingSection.background_color}
                onChange={(e) => setEditingSection(prev => ({ ...prev, background_color: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Цвет текста</Label>
              <Input
                type="color"
                value={editingSection.text_color}
                onChange={(e) => setEditingSection(prev => ({ ...prev, text_color: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Шрифт</Label>
              <select
                value={editingSection.font_family}
                onChange={(e) => setEditingSection(prev => ({ ...prev, font_family: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Толщина шрифта</Label>
              <select
                value={editingSection.font_weight}
                onChange={(e) => setEditingSection(prev => ({ ...prev, font_weight: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                {fontWeightOptions.map(weight => (
                  <option key={weight.value} value={weight.value}>{weight.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="visible"
              checked={editingSection.is_visible}
              onChange={(e) => setEditingSection(prev => ({ ...prev, is_visible: e.target.checked }))}
            />
            <Label htmlFor="visible">Видимый на сайте</Label>
          </div>
        </CardContent>
      </Card>

      {/* Add Items */}
      <Card>
        <CardHeader>
          <CardTitle>Добавить элементы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={() => handleAddItem('text')}>
              <Plus className="w-4 h-4 mr-1" />
              Текст
            </Button>
            <Button size="sm" onClick={() => handleAddItem('image')}>
              <Plus className="w-4 h-4 mr-1" />
              Изображение
            </Button>
            <Button size="sm" onClick={() => handleAddItem('button')}>
              <Plus className="w-4 h-4 mr-1" />
              Кнопка
            </Button>
            <Button size="sm" onClick={() => handleAddItem('link')}>
              <Plus className="w-4 h-4 mr-1" />
              Ссылка
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items Editor */}
      {sectionItems && sectionItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Элементы раздела</h3>
          {sectionItems.map(renderItemEditor)}
        </div>
      )}
    </div>
  );
};

export default DynamicSectionEditor;
