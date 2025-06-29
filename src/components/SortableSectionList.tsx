
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useDynamicSections } from '@/hooks/useDynamicSections';

interface SortableSectionListProps {
  sections: any[];
  onEditSection: (section: any) => void;
}

const SortableSectionList = ({ sections, onEditSection }: SortableSectionListProps) => {
  const { updateSection, deleteSection } = useDynamicSections();
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

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

    const draggedSection = sections[draggedItem];
    const newSections = [...sections];
    
    // Remove dragged item
    newSections.splice(draggedItem, 1);
    
    // Insert at new position
    const adjustedDropIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
    newSections.splice(adjustedDropIndex, 0, draggedSection);

    // Update position_order for all affected sections
    newSections.forEach(async (section, index) => {
      if (section.position_order !== index) {
        await updateSection(section.id, { position_order: index });
      }
    });

    setDraggedItem(null);
  };

  const toggleVisibility = async (section: any) => {
    await updateSection(section.id, { is_visible: !section.is_visible });
  };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card
          key={section.id}
          className={`transition-all border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
            draggedItem === index ? 'opacity-50 scale-95' : 'hover:shadow-md'
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-grab" />
                <div>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">{section.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{section.section_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVisibility(section)}
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {section.is_visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditSection(section)}
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSection(section.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Elements: {section.items?.length || 0}</span>
              <span>Position: {section.position_order}</span>
              <div 
                className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: section.background_color }}
              />
              <span className="truncate max-w-xs">{section.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SortableSectionList;
