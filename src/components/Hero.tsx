import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useSiteSections } from '@/hooks/useSiteSections';
const Hero = () => {
  const {
    getSection,
    loading
  } = useSiteSections();
  const content = getSection('hero') || {
    subtitle: 'Экологически чистые решения',
    title: 'Сделайте свой дом\nчище и безопаснее',
    description: 'Наши продукты созданы из натуральных компонентов без вредных химических веществ. Забота о вашей семье и окружающей среде — наш приоритет.',
    backgroundImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    primaryButtonText: 'Смотреть продукты',
    secondaryButtonText: 'Узнать больше'
  };
  if (loading) {
    return <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </section>;
  }
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${content.backgroundImage})`
    }}>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white py-20">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="max-w-4xl mx-auto">
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="uppercase text-sm tracking-widest mb-8 leading-tight">
            {content.subtitle}
          </motion.p>
          
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight" style={{
          whiteSpace: 'pre-line'
        }}>
            {content.title}
          </motion.h1>
          
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.6
        }} className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-tight">
            {content.description}
          </motion.p>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.8
        }} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" onClick={() => document.getElementById('products')?.scrollIntoView({
            behavior: 'smooth'
          })} className="text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl bg-sky-500 hover:bg-sky-400">
              {content.primaryButtonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline" size="lg" onClick={() => document.getElementById('about')?.scrollIntoView({
            behavior: 'smooth'
          })} className="border-white hover:bg-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-neutral-950">
              <Play className="mr-2 h-5 w-5" />
              {content.secondaryButtonText}
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 1.2
      }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          
        </motion.div>
      </div>
    </section>;
};
export default Hero;