import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SectionItem {
  id: number;
  section_id: number;
  item_type: string;
  content: any;
  text_color: string;
  font_family: string;
  font_weight: string;
  font_size: string;
  position_order: number;
}

interface DynamicSection {
  id: number;
  section_name: string;
  title: string;
  subtitle?: string;
  description?: string;
  background_color: string;
  text_color: string;
  font_family: string;
  font_weight: string;
  font_size: string;
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

      if (sectionsError) throw sectionsError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('section_items')
        .select('*')
        .order('position_order');

      if (itemsError) throw itemsError;

      // Group items by section_id
      const itemsBySection = itemsData?.reduce((acc, item) => {
        if (!acc[item.section_id]) acc[item.section_id] = [];
        acc[item.section_id].push(item);
        return acc;
      }, {} as Record<number, SectionItem[]>) || {};

      // Combine sections with their items
      const sectionsWithItems = sectionsData?.map(section => ({
        ...section,
        items: itemsBySection[section.id] || []
      })) || [];

      setSections(sectionsWithItems);
    } catch (error) {
      console.error('Error fetching dynamic sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (sectionData: {
    section_name: string;
    title: string;
    subtitle?: string;
    description?: string;
    background_color?: string;
    text_color?: string;
    font_family?: string;
    font_weight?: string;
    font_size?: string;
    position_order?: number;
    is_visible?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('dynamic_sections')
        .insert([sectionData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Раздел успешно создан",
      });

      await fetchSections();
      return data;
    } catch (error) {
      console.error('Error creating section:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать раздел",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateSection = async (id: number, updates: {
    section_name?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    background_color?: string;
    text_color?: string;
    font_family?: string;
    font_weight?: string;
    font_size?: string;
    position_order?: number;
    is_visible?: boolean;
  }) => {
    try {
      const { error } = await supabase
        .from('dynamic_sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, ...updates } : section
      ));

      toast({
        title: "Успех",
        description: "Раздел успешно обновлен",
      });

      return true;
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить раздел",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSectionOrder = async (sectionId: number, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('dynamic_sections')
        .update({ position_order: newOrder })
        .eq('id', sectionId);

      if (error) throw error;

      // Update local state immediately
      setSections(prev => prev.map(section => 
        section.id === sectionId ? { ...section, position_order: newOrder } : section
      ));

      return true;
    } catch (error) {
      console.error('Error updating section order:', error);
      return false;
    }
  };

  const deleteSection = async (id: number) => {
    try {
      const { error } = await supabase
        .from('dynamic_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Раздел успешно удален",
      });

      await fetchSections();
      return true;
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить раздел",
        variant: "destructive",
      });
      return false;
    }
  };

  const createItem = async (itemData: {
    section_id: number;
    item_type: string;
    content?: any;
    text_color?: string;
    font_family?: string;
    font_weight?: string;
    font_size?: string;
    position_order?: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('section_items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setSections(prev => prev.map(section => {
        if (section.id === itemData.section_id) {
          return {
            ...section,
            items: [...(section.items || []), data]
          };
        }
        return section;
      }));

      toast({
        title: "Успех",
        description: "Элемент успешно добавлен",
      });

      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить элемент",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateItem = async (id: number, updates: {
    item_type?: string;
    content?: any;
    text_color?: string;
    font_family?: string;
    font_weight?: string;
    font_size?: string;
    position_order?: number;
  }) => {
    try {
      const { error } = await supabase
        .from('section_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setSections(prev => prev.map(section => ({
        ...section,
        items: section.items?.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ) || []
      })));

      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      return false;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('section_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setSections(prev => prev.map(section => ({
        ...section,
        items: section.items?.filter(item => item.id !== id) || []
      })));

      toast({
        title: "Успех",
        description: "Элемент успешно удален",
      });

      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить элемент",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    loading,
    createSection,
    updateSection,
    updateSectionOrder,
    deleteSection,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchSections
  };
};