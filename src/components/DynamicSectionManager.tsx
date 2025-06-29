import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft } from 'lucide-react';
import { useDynamicSections } from '@/hooks/useDynamicSections';
import DynamicSectionEditor from '@/components/DynamicSectionEditor';
import SortableSectionList from '@/components/SortableSectionList';

const DynamicSectionManager = () => {
  const { sections, loading, createSection } = useDynamicSections();
  const [editingSection, setEditingSection] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSection, setNewSection] = useState({
    section_name: '',
    title: '',
    subtitle: '',
    description: '',
    background_color: '#ffffff',
    text_color: '#000000',
    font_family: 'Inter',
    font_weight: '400',
    font_size: 'base',
    is_visible: true
  });

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

  const handleCreateSection = async () => {
    if (!newSection.section_name || !newSection.title) return;

    const result = await createSection({
      ...newSection,
      position_order: sections.length
    });

    if (result) {
      setNewSection({
        section_name: '',
        title: '',
        subtitle: '',
        description: '',
        background_color: '#ffffff',
        text_color: '#000000',
        font_family: 'Inter',
        font_weight: '400',
        font_size: 'base',
        is_visible: true
      });
      setShowCreateForm(false);
    }
  };

  const handleEditSection = (section: any) => {
    setEditingSection(section);
  };

  if (loading) {
    return <div className="text-center p-8">Загрузка...</div>;
  }

  // If editing a section, show the editor
  if (editingSection) {
    return (
      <DynamicSectionEditor
        section={editingSection}
        onClose={() => setEditingSection(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление разделами</h2>
          <p className="text-gray-600">Создавайте и управляйте пользовательскими разделами</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать раздел
        </Button>
      </div>

      {/* Quick Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Быстрое создание раздела</CardTitle>
                <CardDescription>Создайте новый раздел с базовыми настройками</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Имя раздела *</Label>
                <Input
                  value={newSection.section_name}
                  onChange={(e) => setNewSection(prev => ({ ...prev, section_name: e.target.value }))}
                  placeholder="уникальное-имя-раздела"
                />
              </div>
              <div className="space-y-2">
                <Label>Заголовок *</Label>
                <Input
                  value={newSection.title}
                  onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Заголовок раздела"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Подзаголовок</Label>
              <Input
                value={newSection.subtitle}
                onChange={(e) => setNewSection(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Подзаголовок (необязательно)"
              />
            </div>

            <div className="space-y-2">
              <Label>Краткое описание</Label>
              <Textarea
                value={newSection.description}
                onChange={(e) => setNewSection(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Краткое описание раздела"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Цвет фона</Label>
                <Input
                  type="color"
                  value={newSection.background_color}
                  onChange={(e) => setNewSection(prev => ({ ...prev, background_color: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Цвет текста</Label>
                <Input
                  type="color"
                  value={newSection.text_color}
                  onChange={(e) => setNewSection(prev => ({ ...prev, text_color: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Шрифт</Label>
                <select
                  value={newSection.font_family}
                  onChange={(e) => setNewSection(prev => ({ ...prev, font_family: e.target.value }))}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Толщина</Label>
                <select
                  value={newSection.font_weight}
                  onChange={(e) => setNewSection(prev => ({ ...prev, font_weight: e.target.value }))}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {fontWeightOptions.map(weight => (
                    <option key={weight.value} value={weight.value}>{weight.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="new-visible"
                  checked={newSection.is_visible}
                  onChange={(e) => setNewSection(prev => ({ ...prev, is_visible: e.target.checked }))}
                />
                <Label htmlFor="new-visible">Сразу показать на сайте</Label>
              </div>
              <Button 
                onClick={handleCreateSection}
                disabled={!newSection.section_name || !newSection.title}
              >
                Создать и редактировать
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Разделы ({sections.length})
          </h3>
          <p className="text-sm text-gray-600">
            Перетащите разделы для изменения порядка
          </p>
        </div>
        
        {sections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">Пока нет созданных разделов</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Создать первый раздел
              </Button>
            </CardContent>
          </Card>
        ) : (
          <SortableSectionList
            sections={sections.sort((a, b) => a.position_order - b.position_order)}
            onEditSection={handleEditSection}
          />
        )}
      </div>
    </div>
  );
};

export default DynamicSectionManager;
