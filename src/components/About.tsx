import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSiteSections } from '@/hooks/useSiteSections';
const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3
  });
  const {
    getSection,
    loading
  } = useSiteSections();

  // Always use default content as fallback
  const defaultContent = {
    subtitle: 'О нашей компании',
    title: 'Наша миссия',
    description: 'Мы создаем экологически чистые средства для дома и личной гигиены, которые эффективно справляются с загрязнениями, но безопасны для вас, вашей семьи и планеты.',
    secondDescription: 'Наша компания основана в 2010 году группой энтузиастов, которые решили изменить подход к бытовой химии. Мы исследуем, разрабатываем и производим продукты, которые делают вашу жизнь чище и безопаснее.',
    image: 'https://images.unsplash.com/photo-1584464957176-ca369c03c82a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    buttonText: 'Узнать о наших продуктах'
  };

  // Use Supabase content if available, otherwise use default
  const content = getSection('about') || defaultContent;
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  return <section id="about" className="py-20 md:py-32 bg-white">
      <div className="container-custom">
        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
            <p className="section-subtitle text-brand-pink">{content.subtitle}</p>
            <h2 className="section-title text-brand-dark">{content.title}</h2>
            <p className="text-lg text-gray-600 mb-6">
              {content.description}
            </p>
            <p className="text-lg text-gray-600 mb-8">
              {content.secondDescription}
            </p>
            <a href="#products" onClick={e => {
            e.preventDefault();
            document.getElementById('products')?.scrollIntoView({
              behavior: 'smooth'
            });
          }} className="inline-flex items-center text-brand-pink font-medium hover:underline">
              {content.buttonText}
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl opacity-70"></div>
            <img src={content.image} alt="Экологически чистые средства" className="rounded-lg shadow-xl w-full relative z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default About;