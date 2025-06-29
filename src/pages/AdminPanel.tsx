import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/hooks/useAuth';
import AdminLogin from '@/components/AdminLogin';
import ProductManager from '@/components/ProductManager';
import SocialMediaManager from '@/components/SocialMediaManager';
import ContactSocialManager from '@/components/ContactSocialManager';
import SectionVisibilityManager from '@/components/SectionVisibilityManager';
import DynamicSectionManager from '@/components/DynamicSectionManager';
import ImageUpload from '@/components/ImageUpload';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useSiteSections } from '@/hooks/useSiteSections';

const AdminPanelContent = () => {
  const { toast } = useToast();
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const { 
    footerContent, 
    contactContent, 
    sectionVisibility,
    updateFooterContent, 
    updateContactContent, 
    updateSectionVisibility,
    loading: siteContentLoading 
  } = useSiteContent();
  const { sections, loading: sectionsLoading, updateSection, getSection } = useSiteSections();

  // Form states for each section
  const [forms, setForms] = useState({
    header: {
      logoType: 'text',
      logoText: 'ЧИСТЫЙ ДОМ',
      logoImage: '',
      navLinks: []
    },
    hero: {
      subtitle: '',
      title: '',
      description: '',
      backgroundImage: '',
      primaryButtonText: 'Смотреть продукты',
      secondaryButtonText: 'Узнать больше'
    },
    about: {
      subtitle: '',
      title: '',
      description: '',
      secondDescription: '',
      image: '',
      buttonText: ''
    },
    team: {
      subtitle: '',
      title: '',
      description: '',
      buttonText: '',
      members: []
    },
    gallery: {
      subtitle: '',
      title: '',
      description: '',
      images: []
    },
    footer: {
      companyName: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      socialLinks: []
    },
    contact: {
      title: '',
      subtitle: '',
      address: '',
      phone: '',
      email: '',
      workingHours: '',
      socialLinks: []
    }
  });

  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize forms when data loads - only once
  useEffect(() => {
    if (!sectionsLoading && !siteContentLoading && !dataLoaded) {
      console.log('Loading initial data into forms...');
      const newForms = { ...forms };

      // Load section data
      ['header', 'hero', 'about', 'team', 'gallery'].forEach(sectionName => {
        const sectionData = getSection(sectionName);
        if (sectionData) {
          console.log(`Loading ${sectionName} data:`, sectionData);
          newForms[sectionName as keyof typeof forms] = { ...newForms[sectionName as keyof typeof forms], ...sectionData };
        }
      });

      // Load footer and contact data
      if (footerContent) {
        console.log('Loading footer data:', footerContent);
        newForms.footer = { ...newForms.footer, ...footerContent };
      }

      if (contactContent) {
        console.log('Loading contact data:', contactContent);
        newForms.contact = { ...newForms.contact, ...contactContent };
      }

      setForms(newForms);
      setDataLoaded(true);
    }
  }, [sections, sectionsLoading, siteContentLoading, footerContent, contactContent, getSection, dataLoaded]);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из админ-панели.",
    });
  };

  const updateForm = (section: string, field: string, value: any) => {
    console.log(`Updating ${section}.${field} with:`, value);
    setForms(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveSection = async (sectionName: string) => {
    const formData = forms[sectionName as keyof typeof forms];
    let success = false;

    console.log(`Saving ${sectionName} with data:`, formData);

    if (sectionName === 'footer') {
      success = await updateFooterContent(forms.footer);
    } else if (sectionName === 'contact') {
      success = await updateContactContent(forms.contact);
    } else {
      success = await updateSection(sectionName, formData);
    }

    if (success) {
      toast({
        title: "Успех",
        description: `Раздел "${sectionName}" успешно сохранен`,
      });
    }
  };

  const addTeamMember = () => {
    const newMember = {
      id: Date.now(),
      name: 'Новый сотрудник',
      role: 'Должность',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1470&q=80'
    };
    updateForm('team', 'members', [...forms.team.members, newMember]);
  };

  const removeTeamMember = (id: number) => {
    updateForm('team', 'members', forms.team.members.filter((member: any) => member.id !== id));
  };

  const updateTeamMember = (id: number, field: string, value: string) => {
    const updatedMembers = forms.team.members.map((member: any) => 
      member.id === id ? { ...member, [field]: value } : member
    );
    updateForm('team', 'members', updatedMembers);
  };

  const addGalleryImage = () => {
    const newImage = 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?auto=format&fit=crop&w=1471&q=80';
    updateForm('gallery', 'images', [...forms.gallery.images, newImage]);
  };

  const removeGalleryImage = (index: number) => {
    updateForm('gallery', 'images', forms.gallery.images.filter((_: any, i: number) => i !== index));
  };

  const updateGalleryImage = (index: number, value: string) => {
    const updatedImages = forms.gallery.images.map((img: string, i: number) => i === index ? value : img);
    updateForm('gallery', 'images', updatedImages);
  };

  const loading = siteContentLoading || sectionsLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
            <p className="text-gray-600">Полное управление контентом сайта и каталогом продукции</p>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="products">Продукты</TabsTrigger>
            <TabsTrigger value="dynamic">Секции</TabsTrigger>
            <TabsTrigger value="header">Заголовок</TabsTrigger>
            <TabsTrigger value="hero">Главный блок</TabsTrigger>
            <TabsTrigger value="about">О нас</TabsTrigger>
            <TabsTrigger value="team">Команда</TabsTrigger>
            <TabsTrigger value="gallery">Галерея</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="contact">Контакты</TabsTrigger>
            <TabsTrigger value="social">Соц. сети</TabsTrigger>
            <TabsTrigger value="visibility">Видимость</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductManager />
          </TabsContent>

          <TabsContent value="dynamic" className="space-y-4">
            <DynamicSectionManager />
          </TabsContent>

          <TabsContent value="header" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки заголовка</CardTitle>
                <CardDescription>Настройте логотип и навигационное меню</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center">Загрузка...</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Тип логотипа</Label>
                      <select
                        value={forms.header.logoType}
                        onChange={(e) => updateForm('header', 'logoType', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="text">Текст</option>
                        <option value="image">Изображение</option>
                      </select>
                    </div>

                    {forms.header.logoType === 'text' ? (
                      <div className="space-y-2">
                        <Label>Текст логотипа</Label>
                        <Input
                          value={forms.header.logoText}
                          onChange={(e) => updateForm('header', 'logoText', e.target.value)}
                        />
                      </div>
                    ) : (
                      <ImageUpload
                        currentImage={forms.header.logoImage}
                        onImageChange={(imageUrl) => updateForm('header', 'logoImage', imageUrl)}
                        label="Логотип"
                      />
                    )}
                    
                    <Button onClick={() => handleSaveSection('header')}>
                      Сохранить заголовок
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Главный экран</CardTitle>
                <CardDescription>Настройте основной баннер сайта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center">Загрузка...</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Подзаголовок</Label>
                      <Input
                        value={forms.hero.subtitle}
                        onChange={(e) => updateForm('hero', 'subtitle', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Основной заголовок</Label>
                      <Textarea
                        value={forms.hero.title}
                        onChange={(e) => updateForm('hero', 'title', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea
                        value={forms.hero.description}
                        onChange={(e) => updateForm('hero', 'description', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <ImageUpload
                      currentImage={forms.hero.backgroundImage}
                      onImageChange={(imageUrl) => updateForm('hero', 'backgroundImage', imageUrl)}
                      label="Фоновое изображение"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Текст основной кнопки</Label>
                        <Input
                          value={forms.hero.primaryButtonText}
                          onChange={(e) => updateForm('hero', 'primaryButtonText', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Текст второй кнопки</Label>
                        <Input
                          value={forms.hero.secondaryButtonText}
                          onChange={(e) => updateForm('hero', 'secondaryButtonText', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={() => handleSaveSection('hero')}>
                      Сохранить главный блок
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Секция "О нас"</CardTitle>
                <CardDescription>Информация о компании</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center">Загрузка...</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Подзаголовок</Label>
                      <Input
                        value={forms.about.subtitle}
                        onChange={(e) => updateForm('about', 'subtitle', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={forms.about.title}
                        onChange={(e) => updateForm('about', 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Первый абзац</Label>
                      <Textarea
                        value={forms.about.description}
                        onChange={(e) => updateForm('about', 'description', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Второй абзац</Label>
                      <Textarea
                        value={forms.about.secondDescription}
                        onChange={(e) => updateForm('about', 'secondDescription', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <ImageUpload
                      currentImage={forms.about.image}
                      onImageChange={(imageUrl) => updateForm('about', 'image', imageUrl)}
                      label="Изображение"
                    />
                    <div className="space-y-2">
                      <Label>Текст кнопки</Label>
                      <Input
                        value={forms.about.buttonText}
                        onChange={(e) => updateForm('about', 'buttonText', e.target.value)}
                      />
                    </div>
                    
                    <Button onClick={() => handleSaveSection('about')}>
                      Сохранить раздел "О нас"
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление командой</CardTitle>
                <CardDescription>Добавляйте и редактируйте участников команды</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <p className="text-center">Загрузка...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Подзаголовок</Label>
                        <Input
                          value={forms.team.subtitle}
                          onChange={(e) => updateForm('team', 'subtitle', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Заголовок</Label>
                        <Input
                          value={forms.team.title}
                          onChange={(e) => updateForm('team', 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Текст кнопки</Label>
                        <Input
                          value={forms.team.buttonText}
                          onChange={(e) => updateForm('team', 'buttonText', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea
                        value={forms.team.description}
                        onChange={(e) => updateForm('team', 'description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Участники команды</h3>
                        <Button onClick={addTeamMember} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить участника
                        </Button>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Имя</TableHead>
                            <TableHead>Должность</TableHead>
                            <TableHead>Фото</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {forms.team.members.map((member: any) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <Input
                                  value={member.name || ''}
                                  onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={member.role || ''}
                                  onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <ImageUpload
                                  currentImage={member.image || ''}
                                  onImageChange={(imageUrl) => updateTeamMember(member.id, 'image', imageUrl)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeTeamMember(member.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Button onClick={() => handleSaveSection('team')}>
                      Сохранить команду
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление галереей</CardTitle>
                <CardDescription>Добавляйте и редактируйте изображения в галерее</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <p className="text-center">Загрузка...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Подзаголовок</Label>
                        <Input
                          value={forms.gallery.subtitle}
                          onChange={(e) => updateForm('gallery', 'subtitle', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Заголовок</Label>
                        <Input
                          value={forms.gallery.title}
                          onChange={(e) => updateForm('gallery', 'title', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea
                        value={forms.gallery.description}
                        onChange={(e) => updateForm('gallery', 'description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Изображения</h3>
                        <Button onClick={addGalleryImage} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить изображение
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {forms.gallery.images.map((image: string, index: number) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <ImageUpload
                                currentImage={image}
                                onImageChange={(imageUrl) => updateGalleryImage(index, imageUrl)}
                                label={`Изображение ${index + 1}`}
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeGalleryImage(index)}
                              className="mt-6"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button onClick={() => handleSaveSection('gallery')}>
                      Сохранить галерею
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки Footer</CardTitle>
                <CardDescription>Редактируйте информацию в подвале сайта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center">Загрузка...</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Название компании</Label>
                      <Input
                        value={forms.footer.companyName}
                        onChange={(e) => updateForm('footer', 'companyName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Описание компании</Label>
                      <Textarea
                        value={forms.footer.description}
                        onChange={(e) => updateForm('footer', 'description', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Адрес</Label>
                        <Input
                          value={forms.footer.address}
                          onChange={(e) => updateForm('footer', 'address', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Телефон</Label>
                        <Input
                          value={forms.footer.phone}
                          onChange={(e) => updateForm('footer', 'phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={forms.footer.email}
                          onChange={(e) => updateForm('footer', 'email', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={() => handleSaveSection('footer')}>
                      Сохранить Footer
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки контактов</CardTitle>
                <CardDescription>Редактируйте информацию в разделе контактов</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center">Загрузка...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Заголовок</Label>
                        <Input
                          value={forms.contact.title}
                          onChange={(e) => updateForm('contact', 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Подзаголовок</Label>
                        <Textarea
                          value={forms.contact.subtitle}
                          onChange={(e) => updateForm('contact', 'subtitle', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Адрес</Label>
                        <Input
                          value={forms.contact.address}
                          onChange={(e) => updateForm('contact', 'address', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Телефон</Label>
                        <Input
                          value={forms.contact.phone}
                          onChange={(e) => updateForm('contact', 'phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={forms.contact.email}
                          onChange={(e) => updateForm('contact', 'email', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Рабочие часы</Label>
                      <Textarea
                        value={forms.contact.workingHours}
                        onChange={(e) => updateForm('contact', 'workingHours', e.target.value)}
                        placeholder="Пн-Пт: 9:00 - 18:00&#10;Сб-Вс: Выходные"
                        rows={3}
                      />
                    </div>
                    
                    <ContactSocialManager
                      socialLinks={forms.contact.socialLinks || []}
                      onSocialLinksChange={(links) => updateForm('contact', 'socialLinks', links)}
                    />
                    
                    <Button onClick={() => handleSaveSection('contact')}>
                      Сохранить Контакты
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <SocialMediaManager
              socialLinks={forms.footer.socialLinks || []}
              onSocialLinksChange={(links) => updateForm('footer', 'socialLinks', links)}
            />
            <Button onClick={() => handleSaveSection('footer')}>
              Сохранить социальные сети
            </Button>
          </TabsContent>

          <TabsContent value="visibility" className="space-y-4">
            <SectionVisibilityManager
              visibility={sectionVisibility}
              onVisibilityChange={(section, visible) => {
                const newVisibility = { ...sectionVisibility, [section]: visible };
                updateSectionVisibility(newVisibility);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  return (
    <AuthProvider>
      <AdminPanelContent />
    </AuthProvider>
  );
};

export default AdminPanel;