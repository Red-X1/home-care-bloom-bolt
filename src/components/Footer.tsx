
import { useSiteContent } from '@/hooks/useSiteContent';
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const { footerContent } = useSiteContent();

  const getSocialIcon = (platform: string, size: number = 24) => {
    const iconProps = { 
      size, 
      className: "text-white hover:text-brand-pink transition-colors cursor-pointer" 
    };

    switch (platform) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'vk':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className={iconProps.className}>
            <path fill="currentColor" d="M21.547 7h-3.29a.678.678 0 0 0-.653.459s-1.041 2.58-2.515 4.257c-.504.504-.733.664-1.009.664-.137 0-.336-.16-.336-.615V7.538c0-.859-.245-1.538-1.349-1.538h-4.808c-.539 0-.863.4-.863.779 0 .817.122 1.005 1.224 1.236v6.519c0 1.142-.206 1.35-.482 1.35-.887 0-3.045-2.592-4.324-5.559-.252-.717-.503-1.007-1.365-1.007H2.453c-.961 0-1.153.453-1.153.953 0 .897.114 1.084 1.153 3.163 1.668 3.432 4.011 5.291 6.151 5.291 1.284 0 1.442-.481 1.442-1.31v-3.03c0-.961.202-1.153.875-1.153.495 0 1.342.16 3.316 2.798 2.255 2.255 2.625 3.267 3.888 3.267h3.29c.961 0 1.442-.481 1.153-1.433-.317-.952-1.45-2.337-2.951-3.982-.504-.593-.126-.854 0-1.378 0 0 2.497-3.524 2.759-4.715.196-.591-.099-.859-.816-.859z"/>
          </svg>
        );
      case 'telegram':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className={iconProps.className}>
            <path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className={iconProps.className}>
            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.085"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className={iconProps.className}>
            <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case 'pinterest':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className={iconProps.className}>
            <path fill="currentColor" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (!footerContent) {
    return (
      <footer className="bg-brand-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">ЧИСТЫЙ ДОМ</h3>
              <p className="text-gray-300 mb-6">
                Мы создаем экологически чистые средства для дома и личной гигиены.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-300">
                <p>г. Москва, ул. Примерная, д. 123</p>
                <p>+7 (495) 123-45-67</p>
                <p>info@chistydom.ru</p>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Социальные сети</h4>
              <div className="flex space-x-4">
                <Facebook className="text-white hover:text-brand-pink transition-colors cursor-pointer" size={24} />
                <Instagram className="text-white hover:text-brand-pink transition-colors cursor-pointer" size={24} />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ЧИСТЫЙ ДОМ. Все права защищены.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-brand-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{footerContent.companyName}</h3>
            <p className="text-gray-300 mb-6">
              {footerContent.description}
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Контакты</h4>
            <div className="space-y-2 text-gray-300">
              <p>{footerContent.address}</p>
              <p>{footerContent.phone}</p>
              <p>{footerContent.email}</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Социальные сети</h4>
            <div className="flex space-x-4 flex-wrap">
              {footerContent.socialLinks?.filter(link => link.visible).map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                  {getSocialIcon(link.platform, link.size)}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {footerContent.companyName}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
