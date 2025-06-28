
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SectionVisibility {
  hero: boolean;
  about: boolean;
  team: boolean;
  gallery: boolean;
  products: boolean;
  contact: boolean;
}

interface SectionVisibilityManagerProps {
  visibility: SectionVisibility;
  onVisibilityChange: (section: keyof SectionVisibility, visible: boolean) => void;
}

const SECTIONS = [
  { key: 'hero' as const, label: 'Главный блок' },
  { key: 'about' as const, label: 'О нас' },
  { key: 'team' as const, label: 'Наша команда' },
  { key: 'gallery' as const, label: 'Галерея' },
  { key: 'products' as const, label: 'Продукты' },
  { key: 'contact' as const, label: 'Контакты' }
];

const SectionVisibilityManager = ({ visibility, onVisibilityChange }: SectionVisibilityManagerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Видимость разделов</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map(section => (
            <div key={section.key} className="flex items-center justify-between space-x-2">
              <Label htmlFor={section.key}>{section.label}</Label>
              <Switch
                id={section.key}
                checked={visibility[section.key]}
                onCheckedChange={(checked) => onVisibilityChange(section.key, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionVisibilityManager;
