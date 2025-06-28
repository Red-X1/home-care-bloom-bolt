import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSiteSections } from '@/hooks/useSiteSections';
const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1
  });
  const {
    getSection,
    loading
  } = useSiteSections();

  // Always use default content as fallback
  const defaultContent = {
    subtitle: 'Наша галерея',
    title: 'Сделано с любовью',
    description: 'Взгляните на процесс создания наших продуктов — от лаборатории до вашего дома.',
    images: ['https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80', 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', 'https://images.unsplash.com/photo-1550963295-019d8a8a61c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'https://images.unsplash.com/photo-1583907659441-addbe699e921?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80']
  };

  // Use Supabase content if available, otherwise use default
  const content = getSection('gallery') || defaultContent;
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return <section id="gallery" className="py-20 md:py-32 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 20
        }} transition={{
          duration: 0.6
        }} className="section-subtitle text-brand-pink">
            {content.subtitle}
          </motion.p>
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 20
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="section-title text-brand-dark">
            {content.title}
          </motion.h2>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 20
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.description}
          </motion.p>
        </div>

        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.images.map((image: string, index: number) => <motion.div key={index} variants={itemVariants} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={image} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};
export default Gallery;