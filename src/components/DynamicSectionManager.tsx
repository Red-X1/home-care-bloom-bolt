import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Edit, Save, X, MoveUp, MoveDown } from 'lucide-react';
import { useDynamicSections, DynamicSection, SectionItem } from '@/hooks/useDynamicSections';
import ImageUpload from './ImageUpload';

const DynamicSectionManager = () => {
  const { sections, loading, addSection, updateSection, deleteSection, addSectionItem, updateSectionItem, deleteSectionItem } = useDynamicSections();
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddItem, setShowAddItem] = useState<number | null>(null);

  const [newSection, setNewSection] = useState({
    section_name: '',
    title: '',
    subtitle: '',
    description: '',
    background_color: '#ffffff',
    text_color: '#000000',
    position_order: 0,
    is_visible: true
  });

  const [newItem, setNewItem] = useState({
    item_type: 'text' as const,
    content: {
      text: '',
      imageUrl: '',
      linkUrl: '',
      buttonText: '',
      fontSize: '16px',
      fontWeight: '400',
      color: '#000000',
      backgroundColor: 'transparent',
      alignment: 'left' as const
    },
    position_order: 0
  });

  const handleAddSection = async () => {
    const success = await addSection({
      ...newSection,
      position_order: sections.length
    });
    
    if (success) {
      setNewSection({
        section_name: '',
        title: '',
        subtitle: '',
        description: '',
        background_color: '#ffffff',
        text_color: '#000000',
        position_order: 0,
        is_visible: true
      });
      setShowAddSection(false);
    }
  };

  const handleAddItem = async (sectionId: number) => {
    const section = sections.find(s => s.id === sectionId);
    const success = await addSectionItem(sectionId, {
      ...newItem,
      position_order: section?.items?.length || 0
    });
    
    if (success) {
      setNewItem({
        item_type: 'text',
        content: {
          text: '',
          imageUrl: '',
          linkUrl: '',
          buttonText: '',
          fontSize: '16px',
          fontWeight: '400',
          color: '#000000',
          backgroundColor: 'transparent',
          alignment: 'left'
        },
        position_order: 0
      });
      setShowAddItem(null);
    }
  };

  const handleUpdateSection = async (id: number, updates: Partial<DynamicSection>) => {
    const success = await updateSection(id, updates);
    if (success) {
      setEditingSection(null);
    }
  };

  const handleUpdateItem = async (itemId: number, updates: Partial<SectionItem>) => {
    const success = await updateSectionItem(itemId, updates);
    if (success) {
      setEditingItem(null);
    }
  };

  const moveSection = async (sectionId: number, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < sections.length) {
      await updateSection(sectionId, { position_order: newIndex });
      await updateSection(sections[newIndex].id, { position_order: currentIndex });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Загрузка динамических секций...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление динамическими секциями</CardTitle>
          <CardDescription>Создавайте и редактируйте пользовательские секции для главной страницы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Секции</h3>
            <Button onClick={() => setShowAddSection(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить секцию
            </Button>
          </div>

          {showAddSection && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Новая секция</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Название секции</Label>
                    <Input
                      value={newSection.section_name}
                      onChange={(e) => setNewSection({ ...newSection, section_name: e.target.value })}
                      placeholder="unique-section-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input
                      value={newSection.title}
                      onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                      placeholder="Заголовок секции"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Подзаголовок</Label>
                  <Input
                    value={newSection.subtitle}
                    onChange={(e) => setNewSection({ ...newSection, subtitle: e.target.value })}
                    placeholder="Подзаголовок секции"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={newSection.description}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                    placeholder="Описание секции"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Цвет фона</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={newSection.background_color}
                        onChange={(e) => setNewSection({ ...newSection, background_color: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={newSection.background_color}
                        onChange={(e) => setNewSection({ ...newSection, background_color: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Цвет текста</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={newSection.text_color}
                        onChange={(e) => setNewSection({ ...newSection, text_color: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={newSection.text_color}
                        onChange={(e) => setNewSection({ ...newSection, text_color: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newSection.is_visible}
                    onCheckedChange={(checked) => setNewSection({ ...newSection, is_visible: checked })}
                  />
                  <Label>Видимая секция</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddSection}>Добавить</Button>
                  <Button variant="outline" onClick={() => setShowAddSection(false)}>Отмена</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.section_name}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={sections.findIndex(s => s.id === section.id) === 0}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={sections.findIndex(s => s.id === section.id) === sections.length - 1}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSection(section.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSection(section.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingSection === section.id ? (
                    <SectionEditForm
                      section={section}
                      onSave={(updates) => handleUpdateSection(section.id, updates)}
                      onCancel={() => setEditingSection(null)}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Подзаголовок:</strong> {section.subtitle || 'Не указан'}
                        </div>
                        <div>
                          <strong>Видимость:</strong> {section.is_visible ? 'Видимая' : 'Скрытая'}
                        </div>
                      </div>
                      
                      <div>
                        <strong>Описание:</strong> {section.description || 'Не указано'}
                      </div>

                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Элементы секции</h4>
                        <Button
                          size="sm"
                          onClick={() => setShowAddItem(section.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить элемент
                        </Button>
                      </div>

                      {showAddItem === section.id && (
                        <ItemAddForm
                          newItem={newItem}
                          setNewItem={setNewItem}
                          onAdd={() => handleAddItem(section.id)}
                          onCancel={() => setShowAddItem(null)}
                        />
                      )}

                      <div className="space-y-2">
                        {section.items?.map((item) => (
                          <div key={item.id} className="border rounded p-3">
                            {editingItem === item.id ? (
                              <ItemEditForm
                                item={item}
                                onSave={(updates) => handleUpdateItem(item.id, updates)}
                                onCancel={() => setEditingItem(null)}
                              />
                            ) : (
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{item.item_type}</div>
                                  <div className="text-sm text-gray-600">
                                    {item.item_type === 'text' && item.content.text}
                                    {item.item_type === 'image' && item.content.imageUrl}
                                    {item.item_type === 'button' && item.content.buttonText}
                                    {item.item_type === 'link' && item.content.linkUrl}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingItem(item.id)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteSectionItem(item.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SectionEditForm = ({ section, onSave, onCancel }: {
  section: DynamicSection;
  onSave: (updates: Partial<DynamicSection>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(section);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Заголовок</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Подзаголовок</Label>
          <Input
            value={formData.subtitle || ''}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Описание</Label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Цвет фона</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.background_color}
              onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={formData.background_color}
              onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Цвет текста</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.text_color}
              onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={formData.text_color}
              onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_visible}
          onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
        />
        <Label>Видимая секция</Label>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)}>
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Отмена
        </Button>
      </div>
    </div>
  );
};

const ItemAddForm = ({ newItem, setNewItem, onAdd, onCancel }: {
  newItem: any;
  setNewItem: (item: any) => void;
  onAdd: () => void;
  onCancel: () => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить элемент</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Тип элемента</Label>
          <Select
            value={newItem.item_type}
            onValueChange={(value) => setNewItem({ ...newItem, item_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Текст</SelectItem>
              <SelectItem value="image">Изображение</SelectItem>
              <SelectItem value="button">Кнопка</SelectItem>
              <SelectItem value="link">Ссылка</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ItemContentForm item={newItem} setItem={setNewItem} />

        <div className="flex gap-2">
          <Button onClick={onAdd}>Добавить</Button>
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ItemEditForm = ({ item, onSave, onCancel }: {
  item: SectionItem;
  onSave: (updates: Partial<SectionItem>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-4">
      <ItemContentForm item={formData} setItem={setFormData} />
      
      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)}>
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Отмена
        </Button>
      </div>
    </div>
  );
};

const ItemContentForm = ({ item, setItem }: {
  item: any;
  setItem: (item: any) => void;
}) => {
  const updateContent = (key: string, value: any) => {
    setItem({
      ...item,
      content: {
        ...item.content,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {item.item_type === 'text' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Текст</Label>
            <Textarea
              value={item.content.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Введите текст"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Размер шрифта</Label>
              <Select
                value={item.content.fontSize || '16px'}
                onValueChange={(value) => updateContent('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12px">12px</SelectItem>
                  <SelectItem value="14px">14px</SelectItem>
                  <SelectItem value="16px">16px</SelectItem>
                  <SelectItem value="18px">18px</SelectItem>
                  <SelectItem value="20px">20px</SelectItem>
                  <SelectItem value="24px">24px</SelectItem>
                  <SelectItem value="32px">32px</SelectItem>
                  <SelectItem value="48px">48px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Толщина шрифта</Label>
              <Select
                value={item.content.fontWeight || '400'}
                onValueChange={(value) => updateContent('fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light (300)</SelectItem>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                  <SelectItem value="800">Extrabold (800)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Выравнивание</Label>
              <Select
                value={item.content.alignment || 'left'}
                onValueChange={(value) => updateContent('alignment', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">По левому краю</SelectItem>
                  <SelectItem value="center">По центру</SelectItem>
                  <SelectItem value="right">По правому краю</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Цвет текста</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={item.content.color || '#000000'}
                  onChange={(e) => updateContent('color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={item.content.color || '#000000'}
                  onChange={(e) => updateContent('color', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Цвет фона</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={item.content.backgroundColor || 'transparent'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={item.content.backgroundColor || 'transparent'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {item.item_type === 'image' && (
        <ImageUpload
          currentImage={item.content.imageUrl || ''}
          onImageChange={(imageUrl) => updateContent('imageUrl', imageUrl)}
          label="Изображение"
        />
      )}

      {item.item_type === 'button' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Текст кнопки</Label>
            <Input
              value={item.content.buttonText || ''}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              placeholder="Нажмите здесь"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Ссылка</Label>
            <Input
              value={item.content.linkUrl || ''}
              onChange={(e) => updateContent('linkUrl', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Цвет текста</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={item.content.color || '#ffffff'}
                  onChange={(e) => updateContent('color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={item.content.color || '#ffffff'}
                  onChange={(e) => updateContent('color', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Цвет фона</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={item.content.backgroundColor || '#0EA5E9'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={item.content.backgroundColor || '#0EA5E9'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {item.item_type === 'link' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Текст ссылки</Label>
            <Input
              value={item.content.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Перейти по ссылке"
            />
          </div>
          
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={item.content.linkUrl || ''}
              onChange={(e) => updateContent('linkUrl', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Цвет ссылки</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={item.content.color || '#0EA5E9'}
                onChange={(e) => updateContent('color', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={item.content.color || '#0EA5E9'}
                onChange={(e) => updateContent('color', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicSectionManager;