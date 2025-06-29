import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Team from '@/components/Team';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { useSiteContent } from '@/hooks/useSiteContent';
import DarkModeToggle from '@/components/DarkModeToggle';
import DynamicSection from '@/components/DynamicSection';
import { useDynamicSections } from '@/hooks/useDynamicSections';

const Index = () => {
  const { sectionVisibility, loading } = useSiteContent();
  const { sections: dynamicSections, loading: dynamicLoading } = useDynamicSections();

  // Show all sections by default if loading or if visibility data is not available
  const visibility = loading ? {
    hero: true,
    about: true,
    team: true,
    gallery: true,
    products: true,
    contact: true
  } : sectionVisibility;

  return (
    <div className="min-h-screen">
      <Header />
      <DarkModeToggle />
      {visibility.hero && <Hero />}
      {visibility.about && <About />}
      {visibility.products && <Products />}
      {visibility.team && <Team />}
      {visibility.gallery && <Gallery />}
      
      {/* Render dynamic sections */}
      {!dynamicLoading && dynamicSections
        .filter(section => section.is_visible)
        .sort((a, b) => a.position_order - b.position_order)
        .map(section => (
          <DynamicSection
            key={section.id}
            {...section}
          />
        ))}
      
      {visibility.contact && <Contact />}
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
