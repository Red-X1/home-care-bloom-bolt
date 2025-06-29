
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Palette, 
  Heading, 
  Home, 
  Info, 
  Users, 
  Image, 
  Mail, 
  Phone, 
  Share2, 
  Eye, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useDynamicSections } from '@/hooks/useDynamicSections';
import { useIsMobile } from '@/hooks/use-mobile';

interface DynamicSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const DynamicSidebar = ({ activeTab, setActiveTab, onLogout }: DynamicSidebarProps) => {
  const { sections, loading } = useDynamicSections();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [activeTab, isMobile]);

  const staticNavItems = [
    { id: 'dashboard', label: 'Панель управления', icon: LayoutDashboard },
    { id: 'products', label: 'Товары', icon: Package },
    { id: 'sections', label: 'Управление разделами', icon: Layers },
    { id: 'theme', label: 'Тема', icon: Palette },
    { id: 'header', label: 'Заголовок', icon: Heading },
    { id: 'hero', label: 'Главный блок', icon: Home },
    { id: 'about', label: 'О нас', icon: Info },
    { id: 'team', label: 'Команда', icon: Users },
    { id: 'gallery', label: 'Галерея', icon: Image },
    { id: 'footer', label: 'Подвал', icon: Mail },
    { id: 'contact', label: 'Контакты', icon: Phone },
    { id: 'social', label: 'Соц. сети', icon: Share2 },
    { id: 'visibility', label: 'Видимость', icon: Eye }
  ];

  const visibleSections = sections.filter(section => section.is_visible);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'w-64' : 'w-64'}
        h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out z-50
        ${!isMobile && !sidebarOpen ? 'w-16' : ''}
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-lg text-gray-900 dark:text-white ${!sidebarOpen && !isMobile ? 'hidden' : ''}`}>
              Админ панель
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 dark:text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-gray-900 dark:text-white">
              {staticNavItems.find(item => item.id === activeTab)?.label}
            </h1>
            <div></div>
          </div>
        )}

        <nav className="p-2 space-y-1 overflow-y-auto h-full pb-20">
          {/* Static Navigation Items */}
          {staticNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors
                ${activeTab === item.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
                ${!sidebarOpen && !isMobile ? 'justify-center' : ''}
              `}
              title={!sidebarOpen && !isMobile ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(sidebarOpen || isMobile) && (
                <span className="text-sm">{item.label}</span>
              )}
            </button>
          ))}

          {/* Dynamic Section Navigation */}
          {!loading && visibleSections.length > 0 && (
            <>
              <div className="px-3 py-2 mt-4">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Пользовательские разделы
                </div>
              </div>
              {visibleSections
                .sort((a, b) => a.position_order - b.position_order)
                .map((section) => (
                  <button
                    key={`section-${section.id}`}
                    onClick={() => setActiveTab(`section-${section.id}`)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors
                      ${activeTab === `section-${section.id}`
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                      ${!sidebarOpen && !isMobile ? 'justify-center' : ''}
                    `}
                    title={!sidebarOpen && !isMobile ? section.title : ''}
                  >
                    <Layers className="w-5 h-5 flex-shrink-0" />
                    {(sidebarOpen || isMobile) && (
                      <span className="text-sm truncate">{section.title}</span>
                    )}
                  </button>
                ))}
            </>
          )}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            onClick={onLogout}
            className={`w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${!sidebarOpen && !isMobile ? 'px-2' : ''}`}
          >
            <LogOut className="w-4 h-4" />
            {(sidebarOpen || isMobile) && <span className="ml-2">Выйти</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default DynamicSidebar;
