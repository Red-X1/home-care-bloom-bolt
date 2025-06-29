
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FooterContent {
  companyName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  socialLinks?: Array<{
    id: string;
    platform: string;
    url: string;
    size: number;
    visible: boolean;
  }>;
}

interface ContactContent {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

interface SectionVisibility {
  hero: boolean;
  about: boolean;
  team: boolean;
  gallery: boolean;
  products: boolean;
  contact: boolean;
}

export const useSiteContent = () => {
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
    hero: true,
    about: true,
    team: true,
    gallery: true,
    products: true,
    contact: true
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      console.log('Fetching site content from Supabase...');
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) {
        console.error('Error fetching site content:', error);
        setLoading(false);
        return;
      }

      console.log('Site content fetched successfully:', data);
      
      data?.forEach(item => {
        if (item.section === 'footer' && item.content) {
          const content = item.content as any;
          if (content && typeof content === 'object') {
            setFooterContent(content as FooterContent);
          }
        } else if (item.section === 'contact' && item.content) {
          const content = item.content as any;
          if (content && typeof content === 'object') {
            setContactContent(content as ContactContent);
          }
        } else if (item.section === 'visibility' && item.content) {
          const content = item.content as any;
          if (content && typeof content === 'object') {
            setSectionVisibility(prev => ({ ...prev, ...content }));
          }
        }
      });
    } catch (error) {
      console.error('Error fetching site content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFooterContent = async (content: FooterContent) => {
    try {
      console.log('Updating footer content:', content);
      
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section: 'footer', 
          content: content as any
        }, {
          onConflict: 'section'
        });

      if (error) {
        console.error('Error updating footer content:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить footer",
          variant: "destructive",
        });
        return false;
      }

      setFooterContent(content);
      toast({
        title: "Успех",
        description: "Footer успешно обновлен",
      });
      return true;
    } catch (error) {
      console.error('Error updating footer content:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить footer",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateContactContent = async (content: ContactContent) => {
    try {
      console.log('Updating contact content:', content);
      
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section: 'contact', 
          content: content as any
        }, {
          onConflict: 'section'
        });

      if (error) {
        console.error('Error updating contact content:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить контакты",
          variant: "destructive",
        });
        return false;
      }

      setContactContent(content);
      toast({
        title: "Успех",
        description: "Контакты успешно обновлены",
      });
      return true;
    } catch (error) {
      console.error('Error updating contact content:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить контакты",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSectionVisibility = async (visibility: SectionVisibility) => {
    try {
      console.log('Updating section visibility:', visibility);
      
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section: 'visibility', 
          content: visibility as any
        }, {
          onConflict: 'section'
        });

      if (error) {
        console.error('Error updating section visibility:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить видимость разделов",
          variant: "destructive",
        });
        return false;
      }

      setSectionVisibility(visibility);
      toast({
        title: "Успех",
        description: "Видимость разделов успешно обновлена",
      });
      return true;
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить видимость разделов",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    footerContent,
    contactContent,
    sectionVisibility,
    loading,
    updateFooterContent,
    updateContactContent,
    updateSectionVisibility,
    refetch: fetchContent
  };
};
