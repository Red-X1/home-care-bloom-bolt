import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useDynamicSections } from '@/hooks/useDynamicSections';
import { useToast } from '@/hooks/use-toast';

interface SectionVisibility {
  hero: boolean;
  about: boolean;
  team: boolean;
  gallery: boolean;
  products: boolean;
  contact: boolean;
}

interface SectionItem {
  id: string;
  label: string;
  visible: boolean;
  type: 'static' | 'dynamic';
  order: number;
  originalId?: number;
}

const EnhancedVisibilityManager = () => {
  const { sectionVisibility, updateSectionVisibility } = useSiteContent();
  const { sections: dynamicSections, updateSection, updateSectionOrder } = useDynamicSections();
  const [allSections, setAllSections] = useState<SectionItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<SectionItem[]>([]);
  const { toast } = useToast();

  // Initialize sections list
  useEffect(() => {
    const staticSections = [
      { id: 'hero', label: 'Главный блок', visible: sectionVisibility.hero, type: 'static' as const, order: 0 },
      { id: 'about', label: 'О нас', visible: sectionVisibility.about, type: 'static' as const, order: 1 },
      { id: 'products', label: 'Продукты', visible: sectionVisibility.products, type: 'static' as const, order: 2 },
      { id: 'team', label: 'Наша команда', visible: sectionVisibility.team, type: 'static' as const, order: 3 },
      { id: 'gallery', label: 'Галерея', visible: sectionVisibility.gallery, type: 'static' as const, order: 4 },
      { id: 'contact', label: 'Контакты', visible: sectionVisibility.contact, type: 'static' as const, order: 5 }
    ];

    const dynamicSectionItems = dynamicSections.map((section) => ({
      id: `dynamic-${section.id}`,
      label: section.title,
      visible: section.is_visible,
      type: 'dynamic' as const,
      order: 6 + section.position_order,
      originalId: section.id
    }));

    const combined = [...staticSections, ...dynamicSectionItems].sort((a, b) => a.order - b.order);
    setAllSections(combined);
    setOriginalOrder([...combined]);
    setHasChanges(false);
  }, [sectionVisibility, dynamicSections]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newSections = [...allSections];
    const draggedSection = newSections[draggedItem];
    
    // Remove dragged item
    newSections.splice(draggedItem, 1);
    
    // Insert at new position
    const adjustedDropIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
    newSections.splice(adjustedDropIndex, 0, draggedSection);

    // Update order values
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));

    setAllSections(updatedSections);
    setDraggedItem(null);
    setHasChanges(true);
  };

  const toggleSectionVisibility = async (sectionId: string, visible: boolean) => {
    if (sectionId.startsWith('dynamic-')) {
      // Handle dynamic section
      const dynamicId = parseInt(sectionId.replace('dynamic-', ''));
      await updateSection(dynamicId, { is_visible: visible });
    } else {
      // Handle static section
      const newVisibility = { ...sectionVisibility, [sectionId]: visible };
      await updateSectionVisibility(newVisibility);
    }

    // Update local state
    setAllSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, visible } : section
    ));
  };

  const saveOrder = async () => {
    try {
      // Save dynamic sections order
      const dynamicSectionUpdates = allSections
        .filter(section => section.type === 'dynamic' && section.originalId)
        .map(async (section, index) => {
          const newOrder = allSections.findIndex(s => s.id === section.id);
          console.log(`Updating section ${section.originalId} to order ${newOrder}`);
          return await updateSectionOrder(section.originalId!, newOrder);
        });

      const results = await Promise.all(dynamicSectionUpdates);
      
      if (results.every(result => result === true)) {
        setHasChanges(false);
        setOriginalOrder([...allSections]);
        toast({
          title: "Успех",
          description: "Порядок разделов успешно сохранен",
        });
      } else {
        throw new Error('Some updates failed');
      }
    } catch (error) {
      console.error('Error saving section order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить порядок разделов",
        variant: "destructive",
      });
      // Revert to original order
      setAllSections([...originalOrder]);
      setHasChanges(false);
    }
  };

  const resetOrder = () => {
    setAllSections([...originalOrder]);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление видимостью разделов</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Управляйте порядком отображения и видимостью разделов на сайте
          </p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetOrder}>
              Отменить
            </Button>
            <Button onClick={saveOrder} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Сохранить порядок
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Порядок разделов на сайте</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Перетащите разделы для изменения их порядка на главной странице
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allSections.map((section, index) => (
              <div
                key={section.id}
                className={`flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all cursor-move ${
                  draggedItem === index ? 'opacity-50 scale-95' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-grab" />
                  <div className="flex items-center gap-2">
                    {section.visible ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {section.label}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                      {section.type === 'dynamic' ? 'Пользовательский' : 'Системный'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Позиция: {index + 1}
                  </span>
                  <Switch
                    checked={section.visible}
                    onCheckedChange={(checked) => toggleSectionVisibility(section.id, checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Справка</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>• <strong>Перетаскивание:</strong> Зажмите и перетащите разделы для изменения их порядка</p>
          <p>• <strong>Видимость:</strong> Используйте переключатели для показа/скрытия разделов</p>
          <p>• <strong>Системные разделы:</strong> Встроенные разделы сайта</p>
          <p>• <strong>Пользовательские разделы:</strong> Созданные вами разделы</p>
          <p>• <strong>Сохранение:</strong> Нажмите "Сохранить порядок" после изменения последовательности</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVisibilityManager;