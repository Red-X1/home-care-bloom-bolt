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

const Index = () => {
  const { sectionVisibility, loading } = useSiteContent();

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
      {visibility.hero && <Hero />}
      {visibility.about && <About />}
      {visibility.products && <Products />}
      {visibility.team && <Team />}
      {visibility.gallery && <Gallery />}
      {visibility.contact && <Contact />}
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;