import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Trash2, Plus } from 'lucide-react';
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';

interface ContactSocialLink {
  id: string;
  platform: string;
  url: string;
  size: number;
  visible: boolean;
}

interface ContactSocialManagerProps {
  socialLinks: ContactSocialLink[];
  onSocialLinksChange: (links: ContactSocialLink[]) => void;
}

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'vk', label: 'VK', icon: null },
  { value: 'telegram', label: 'Telegram', icon: null },
  { value: 'whatsapp', label: 'WhatsApp Business', icon: null },
  { value: 'tiktok', label: 'TikTok', icon: null },
  { value: 'pinterest', label: 'Pinterest', icon: null }
];

const ContactSocialManager = ({ socialLinks, onSocialLinksChange }: ContactSocialManagerProps) => {
  const [newLink, setNewLink] = useState({
    platform: '',
    url: '',
    size: 24,
    visible: true
  });

  const addSocialLink = () => {
    if (newLink.platform && newLink.url) {
      const link: ContactSocialLink = {
        id: Date.now().toString(),
        platform: newLink.platform,
        url: newLink.url,
        size: newLink.size,
        visible: newLink.visible
      };
      onSocialLinksChange([...socialLinks, link]);
      setNewLink({ platform: '', url: '', size: 24, visible: true });
    }
  };

  const removeSocialLink = (id: string) => {
    onSocialLinksChange(socialLinks.filter(link => link.id !== id));
  };

  const updateSocialLink = (id: string, field: keyof ContactSocialLink, value: any) => {
    onSocialLinksChange(
      socialLinks.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const getSocialIcon = (platform: string) => {
    if (platform === 'vk') {
      return (
        <img 
          src="/image.png" 
          alt="VK" 
          className="w-4 h-4"
          style={{ filter: 'invert(1)' }}
        />
      );
    }
    
    const platformData = SOCIAL_PLATFORMS.find(p => p.value === platform);
    if (platformData?.icon) {
      const IconComponent = platformData.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <div className="w-4 h-4 bg-gray-300 rounded"></div>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Социальные сети в контактах</CardTitle>
        <CardDescription>Управление социальными сетями для раздела контактов</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Платформа</Label>
            <Select value={newLink.platform} onValueChange={(value) => setNewLink({...newLink, platform: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите платформу" />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map(platform => (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      {getSocialIcon(platform.value)}
                      {platform.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={newLink.url}
              onChange={(e) => setNewLink({...newLink, url: e.target.value})}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Размер: {newLink.size}px</Label>
            <Slider
              value={[newLink.size]}
              onValueChange={(value) => setNewLink({...newLink, size: value[0]})}
              min={16}
              max={48}
              step={2}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addSocialLink} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Платформа</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Размер</TableHead>
              <TableHead>Видимость</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {socialLinks.map(link => (
              <TableRow key={link.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getSocialIcon(link.platform)}
                    {SOCIAL_PLATFORMS.find(p => p.value === link.platform)?.label}
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                    className="min-w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <span className="text-sm">{link.size}px</span>
                    <Slider
                      value={[link.size]}
                      onValueChange={(value) => updateSocialLink(link.id, 'size', value[0])}
                      min={16}
                      max={48}
                      step={2}
                      className="w-20"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={link.visible}
                    onChange={(e) => updateSocialLink(link.id, 'visible', e.target.checked)}
                    className="w-4 h-4"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSocialLink(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContactSocialManager;