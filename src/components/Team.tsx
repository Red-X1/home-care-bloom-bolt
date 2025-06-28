import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSiteSections } from '@/hooks/useSiteSections';
const Team = () => {
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
    subtitle: 'Наша команда',
    title: 'Профессионалы своего дела',
    description: 'Наша команда объединяет опытных специалистов в области химии, экологии и производства, увлеченных идеей создания безопасных средств для дома.',
    buttonText: 'Присоединиться к команде',
    members: [{
      id: 1,
      name: 'Елена Смирнова',
      role: 'Генеральный директор',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    }, {
      id: 2,
      name: 'Андрей Петров',
      role: 'Технический директор',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
    }, {
      id: 3,
      name: 'Ольга Иванова',
      role: 'Руководитель разработки',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
    }, {
      id: 4,
      name: 'Михаил Соколов',
      role: 'Маркетинг директор',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
    }]
  };

  // Use Supabase content if available, otherwise use default
  const content = getSection('team') || defaultContent;
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
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return <section id="team" className="py-20 md:py-32 bg-white">
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
        }} className="section-subtitle text-blue-500">
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

        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.members.map((member: any) => <motion.div key={member.id} variants={itemVariants} className="text-center">
              <div className="mb-4 overflow-hidden rounded-full aspect-square w-48 h-48 mx-auto">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold mb-1 text-brand-dark">{member.name}</h3>
              <p className="text-brand-pink">{member.role}</p>
            </motion.div>)}
        </motion.div>

        {content.buttonText && <motion.div initial={{
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
        delay: 0.6
      }} className="mt-12 text-center">
            <a href="#contact" onClick={e => {
          e.preventDefault();
          document.getElementById('contact')?.scrollIntoView({
            behavior: 'smooth'
          });
        }} className="rounded-md bg-brand-pink hover:bg-brand-pink px-8 py-3 text-md font-medium text-white transition-colors inline-flex items-center">
              {content.buttonText}
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </motion.div>}
      </div>
    </section>;
};
export default Team;