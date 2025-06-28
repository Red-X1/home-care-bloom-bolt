
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSiteSections } from '@/hooks/useSiteSections';

const Header = () => {
  const { getSection, loading } = useSiteSections();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerContent = getSection('header') || {
    logoType: 'text',
    logoText: 'ЧИСТЫЙ ДОМ',
    logoImage: '/lovable-uploads/dbc12c6e-c66a-49b0-87d1-689ef14b8f29.png',
    navLinks: [
      { name: 'О нас', href: '#about' },
      { name: 'Продукты', href: '#products' },
      { name: 'Команда', href: '#team' },
      { name: 'Галерея', href: '#gallery' },
      { name: 'Контакты', href: '#contact' },
    ]
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            {headerContent.logoType === 'image' ? (
              <img 
                src={headerContent.logoImage} 
                alt="Logo" 
                className="h-8 w-auto"
              />
            ) : (
              <h1 className={`text-2xl font-bold ${scrolled ? 'text-brand-dark' : 'text-white'}`}>
                {headerContent.logoText}
              </h1>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {headerContent.navLinks.map((link: any) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors hover:text-brand-pink ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-md ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-4">
              {headerContent.navLinks.map((link: any) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-700 hover:text-brand-pink font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
