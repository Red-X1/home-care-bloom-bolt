
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSocialMedia, SocialLink } from '@/hooks/useSocialMedia';

const UnifiedSocialMediaManager = () => {
  const { socialLinks, loading, updateSocialLinks } = useSocialMedia();
  const [editedLinks, setEditedLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState({
    platform: 'facebook',
    url: '',
    size: 24,
    visible: true,
    showInFooter: true,
    showInContact: false
  });

  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', icon: '📘' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'telegram', label: 'Telegram', icon: '✈️' },
    { value: 'whatsapp', label: 'WhatsApp Business', icon: '📱' },
    { value: 'vk', label: 'VK (ВКонтакте)', icon: '🔵' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'discord', label: 'Discord', icon: '🎮' }
  ];

  // Initialize edited links when socialLinks loads
  useState(() => {
    if (socialLinks.length > 0 && editedLinks.length === 0) {
      setEditedLinks([...socialLinks]);
    }
  });

  const addSocialLink = () => {
    if (!newLink.url) return;

    const newSocialLink: SocialLink = {
      id: Date.now().toString(),
      ...newLink
    };

    const updatedLinks = [...editedLinks, newSocialLink];
    setEditedLinks(updatedLinks);
    setNewLink({
      platform: 'facebook',
      url: '',
      size: 24,
      visible: true,
      showInFooter: true,
      showInContact: false
    });
  };

  const removeSocialLink = (id: string) => {
    setEditedLinks(editedLinks.filter(link => link.id !== id));
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setEditedLinks(
      editedLinks.map(link => 
        link.id === id ? { ...link, ...updates } : link
      )
    );
  };

  const handleSave = async () => {
    await updateSocialLinks(editedLinks);
  };

  if (loading) {
    return <div className="text-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Единое управление социальными сетями</CardTitle>
          <CardDescription>
            Управляйте всеми социальными ссылками из одного места. 
            Они автоматически синхронизируются между Footer и Контактами.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Link */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Добавить социальную сеть</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Label>Размер: {newLink.size}px</Label>
                <Slider
                  value={[newLink.size]}
                  onValueChange={(value) => setNewLink(prev => ({ ...prev, size: value[0] }))}
                  max={48}
                  min={16}
                  step={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Отображение</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="new-footer"
                      checked={newLink.showInFooter}
                      onChange={(e) => setNewLink(prev => ({ ...prev, showInFooter: e.target.checked }))}
                    />
                    <Label htmlFor="new-footer" className="text-sm">Footer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="new-contact"
                      checked={newLink.showInContact}
                      onChange={(e) => setNewLink(prev => ({ ...prev, showInContact: e.target.checked }))}
                    />
                    <Label htmlFor="new-contact" className="text-sm">Контакты</Label>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={addSocialLink}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>

          {/* Current Links */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Социальные сети</h3>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Сохранить изменения
              </Button>
            </div>
            
            {editedLinks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Нет добавленных социальных сетей</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Платформа</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Размер</TableHead>
                      <TableHead>Отображение</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedLinks.map((link) => {
                      const platform = socialPlatforms.find(p => p.value === link.platform);
                      return (
                        <TableRow key={link.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{platform?.icon}</span>
                              <span className="text-sm">{platform?.label}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="url"
                              value={link.url}
                              onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                              className="min-w-[200px]"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2 min-w-[120px]">
                              <div className="text-sm">{link.size}px</div>
                              <Slider
                                value={[link.size]}
                                onValueChange={(value) => updateSocialLink(link.id, { size: value[0] })}
                                max={48}
                                min={16}
                                step={2}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`${link.id}-visible`}
                                  checked={link.visible}
                                  onChange={(e) => updateSocialLink(link.id, { visible: e.target.checked })}
                                />
                                <Label htmlFor={`${link.id}-visible`} className="text-sm">Видимый</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`${link.id}-footer`}
                                  checked={link.showInFooter}
                                  onChange={(e) => updateSocialLink(link.id, { showInFooter: e.target.checked })}
                                />
                                <Label htmlFor={`${link.id}-footer`} className="text-sm">Footer</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`${link.id}-contact`}
                                  checked={link.showInContact}
                                  onChange={(e) => updateSocialLink(link.id, { showInContact: e.target.checked })}
                                />
                                <Label htmlFor={`${link.id}-contact`} className="text-sm">Контакты</Label>
                              </div>
                            </div>
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedSocialMediaManager;
