
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  size: number;
  visible: boolean;
}

interface ContactSocialMediaProps {
  socialLinks: SocialLink[];
  onSocialLinksChange: (links: SocialLink[]) => void;
}

const ContactSocialMedia = ({ socialLinks, onSocialLinksChange }: ContactSocialMediaProps) => {
  const [newLink, setNewLink] = useState({
    platform: 'facebook',
    url: '',
    size: 24,
    visible: true
  });

  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', icon: '📘' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'telegram', label: 'Telegram', icon: '✈️' },
    { value: 'whatsapp', label: 'WhatsApp Business', icon: '📱' },
    { value: 'vk', label: 'VK (ВКонтакте)', icon: '🔵' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'discord', label: 'Discord', icon: '🎮' }
  ];

  const addSocialLink = () => {
    if (!newLink.url) return;

    const newSocialLink: SocialLink = {
      id: Date.now().toString(),
      ...newLink
    };

    onSocialLinksChange([...socialLinks, newSocialLink]);
    setNewLink({
      platform: 'facebook',
      url: '',
      size: 24,
      visible: true
    });
  };

  const removeSocialLink = (id: string) => {
    onSocialLinksChange(socialLinks.filter(link => link.id !== id));
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    onSocialLinksChange(
      socialLinks.map(link => 
        link.id === id ? { ...link, ...updates } : link
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Социальные сети в контактах</CardTitle>
        <CardDescription>Управление иконками социальных сетей в разделе контактов</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Добавить социальную сеть</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Платформа</Label>
              <select
                value={newLink.platform}
                onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                {socialPlatforms.map(platform => (
                  <option key={platform.value} value={platform.value}>
                    {platform.icon} {platform.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Размер иконки: {newLink.size}px</Label>
              <Slider
                value={[newLink.size]}
                onValueChange={(value) => setNewLink(prev => ({ ...prev, size: value[0] }))}
                max={48}
                min={16}
                step={2}
              />
            </div>
          </div>
          <Button onClick={addSocialLink}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Текущие социальные сети</h3>
          {socialLinks.length === 0 ? (
            <p className="text-gray-500">Нет добавленных социальных сетей</p>
          ) : (
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
                {socialLinks.map((link) => {
                  const platform = socialPlatforms.find(p => p.value === link.platform);
                  return (
                    <TableRow key={link.id}>
                      <TableCell>
                        {platform?.icon} {platform?.label}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="text-sm">{link.size}px</div>
                          <Slider
                            value={[link.size]}
                            onValueChange={(value) => updateSocialLink(link.id, { size: value[0] })}
                            max={48}
                            min={16}
                            step={2}
                            className="w-20"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={link.visible}
                          onChange={(e) => updateSocialLink(link.id, { visible: e.target.checked })}
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSocialMedia;
