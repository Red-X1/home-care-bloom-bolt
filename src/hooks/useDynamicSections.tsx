import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SectionItem {
  id: number;
  section_id: number;
  item_type: 'text' | 'image' | 'button' | 'link';
  content: {
    text?: string;
    imageUrl?: string;
    linkUrl?: string;
    buttonText?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  position_order: number;
}

export interface DynamicSection {
  id: number;
  section_name: string;
  title: string;
  subtitle?: string;
  description?: string;
  background_color: string;
  text_color: string;
  position_order: number;
  is_visible: boolean;
  items?: SectionItem[];
}

export const useDynamicSections = () => {
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSections = async () => {
    try {
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('dynamic_sections')
        .select('*')
        .order('position_order');

      if (sectionsError) {
        console.error('Error fetching sections:', sectionsError);
        setLoading(false);
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('section_items')
        .select('*')
        .order('position_order');

      if (itemsError) {
        console.error('Error fetching section items:', itemsError);
      }

      const sectionsWithItems = sectionsData?.map(section => ({
        ...section,
        items: itemsData?.filter(item => item.section_id === section.id) || []
      })) || [];

      setSections(sectionsWithItems);
    } catch (error) {
      console.error('Error fetching dynamic sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = async (section: Omit<DynamicSection, 'id' | 'items'>) => {
    try {
      const { data, error } = await supabase
        .from('dynamic_sections')
        .insert([section])
        .select()
        .single();

      if (error) {
        console.error('Error adding section:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось добавить секцию",
          variant: "destructive",
        });
        return false;
      }

      setSections(prev => [...prev, { ...data, items: [] }]);
      toast({
        title: "Успех",
        description: "Секция успешно добавлена",
      });
      return true;
    } catch (error) {
      console.error('Error adding section:', error);
      return false;
    }
  };

  const updateSection = async (id: number, updates: Partial<DynamicSection>) => {
    try {
      const { error } = await supabase
        .from('dynamic_sections')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating section:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить секцию",
          variant: "destructive",
        });
        return false;
      }

      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, ...updates } : section
      ));
      
      toast({
        title: "Успех",
        description: "Секция успешно обновлена",
      });
      return true;
    } catch (error) {
      console.error('Error updating section:', error);
      return false;
    }
  };

  const deleteSection = async (id: number) => {
    try {
      const { error } = await supabase
        .from('dynamic_sections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting section:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить секцию",
          variant: "destructive",
        });
        return false;
      }

      setSections(prev => prev.filter(section => section.id !== id));
      toast({
        title: "Успех",
        description: "Секция успешно удалена",
      });
      return true;
    } catch (error) {
      console.error('Error deleting section:', error);
      return false;
    }
  };

  const addSectionItem = async (sectionId: number, item: Omit<SectionItem, 'id' | 'section_id'>) => {
    try {
      const { data, error } = await supabase
        .from('section_items')
        .insert([{ ...item, section_id: sectionId }])
        .select()
        .single();

      if (error) {
        console.error('Error adding section item:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось добавить элемент",
          variant: "destructive",
        });
        return false;
      }

      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, items: [...(section.items || []), data] }
          : section
      ));

      toast({
        title: "Успех",
        description: "Элемент успешно добавлен",
      });
      return true;
    } catch (error) {
      console.error('Error adding section item:', error);
      return false;
    }
  };

  const updateSectionItem = async (itemId: number, updates: Partial<SectionItem>) => {
    try {
      const { error } = await supabase
        .from('section_items')
        .update(updates)
        .eq('id', itemId);

      if (error) {
        console.error('Error updating section item:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить элемент",
          variant: "destructive",
        });
        return false;
      }

      setSections(prev => prev.map(section => ({
        ...section,
        items: section.items?.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      })));

      return true;
    } catch (error) {
      console.error('Error updating section item:', error);
      return false;
    }
  };

  const deleteSectionItem = async (itemId: number) => {
    try {
      const { error } = await supabase
        .from('section_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting section item:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить элемент",
          variant: "destructive",
        });
        return false;
      }

      setSections(prev => prev.map(section => ({
        ...section,
        items: section.items?.filter(item => item.id !== itemId)
      })));

      toast({
        title: "Успех",
        description: "Элемент успешно удален",
      });
      return true;
    } catch (error) {
      console.error('Error deleting section item:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    loading,
    addSection,
    updateSection,
    deleteSection,
    addSectionItem,
    updateSectionItem,
    deleteSectionItem,
    refetch: fetchSections
  };
};