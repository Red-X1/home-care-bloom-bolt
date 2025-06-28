
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteSection {
  id: number;
  section_name: string;
  content: any;
  created_at: string;
  updated_at: string;
}

export const useSiteSections = () => {
  const [sections, setSections] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSections = async () => {
    try {
      console.log('Fetching site sections from Supabase...');
      
      const { data, error } = await supabase
        .from('site_sections')
        .select('*');

      if (error) {
        console.error('Error fetching site sections:', error);
        // Don't show toast for loading errors, just log and continue with defaults
        console.log('Will use default content instead');
        setLoading(false);
        return;
      }

      console.log('Site sections fetched successfully:', data);
      
      // Convert array to object for easy access
      const sectionsMap: { [key: string]: any } = {};
      data?.forEach(section => {
        sectionsMap[section.section_name] = section.content;
      });
      
      setSections(sectionsMap);
    } catch (error) {
      console.error('Error fetching site sections:', error);
      // On error, just use default data
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (sectionName: string, content: any) => {
    try {
      console.log('Updating section:', sectionName, content);
      
      // Use upsert to update or create record
      const { data, error } = await supabase
        .from('site_sections')
        .upsert({ 
          section_name: sectionName, 
          content: content 
        }, {
          onConflict: 'section_name'
        })
        .select();

      if (error) {
        console.error('Error updating section:', error);
        toast({
          title: "Ошибка",
          description: `Не удалось обновить раздел ${sectionName}`,
          variant: "destructive",
        });
        return false;
      }

      console.log('Update result:', data);

      // Update local state
      setSections(prev => ({
        ...prev,
        [sectionName]: content
      }));

      toast({
        title: "Успех",
        description: `Раздел ${sectionName} успешно обновлен`,
      });
      return true;
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось обновить раздел ${sectionName}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const getSection = (sectionName: string) => {
    return sections[sectionName] || null;
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    loading,
    updateSection,
    getSection,
    refetch: fetchSections
  };
};
