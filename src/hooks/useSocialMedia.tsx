
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  size: number;
  visible: boolean;
  showInFooter: boolean;
  showInContact: boolean;
}

export const useSocialMedia = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'social_media');

      if (error) throw error;

      if (data && data.length > 0) {
        const socialData = data[0].content as any;
        if (socialData && Array.isArray(socialData.links)) {
          setSocialLinks(socialData.links);
        }
      }
    } catch (error) {
      console.error('Error fetching social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLinks = async (links: SocialLink[]) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          section: 'social_media',
          content: { links } as any
        }, {
          onConflict: 'section'
        });

      if (error) throw error;

      setSocialLinks(links);
      toast({
        title: "Успех",
        description: "Социальные сети обновлены",
      });
      return true;
    } catch (error) {
      console.error('Error updating social links:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить социальные сети",
        variant: "destructive",
      });
      return false;
    }
  };

  const getFooterLinks = () => {
    return socialLinks.filter(link => link.showInFooter && link.visible);
  };

  const getContactLinks = () => {
    return socialLinks.filter(link => link.showInContact && link.visible);
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  return {
    socialLinks,
    loading,
    updateSocialLinks,
    getFooterLinks,
    getContactLinks,
    refetch: fetchSocialLinks
  };
};
