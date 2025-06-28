import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useDynamicSections } from '@/hooks/useDynamicSections';

const DynamicSections = () => {
  const { sections, loading } = useDynamicSections();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1
  });

  if (loading || !sections.length) {
    return null;
  }

  const visibleSections = sections.filter(section => section.is_visible);

  if (!visibleSections.length) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div ref={ref}>
      {visibleSections.map((section, index) => (
        <motion.section
          key={section.id}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="py-20 md:py-32"
          style={{
            backgroundColor: section.background_color,
            color: section.text_color
          }}
        >
          <div className="container-custom">
            <motion.div variants={itemVariants} className="text-center mb-12">
              {section.subtitle && (
                <p className="section-subtitle mb-4" style={{ color: section.text_color }}>
                  {section.subtitle}
                </p>
              )}
              <h2 className="section-title mb-6" style={{ color: section.text_color }}>
                {section.title}
              </h2>
              {section.description && (
                <p className="text-lg max-w-2xl mx-auto" style={{ color: section.text_color }}>
                  {section.description}
                </p>
              )}
            </motion.div>

            {section.items && section.items.length > 0 && (
              <motion.div variants={containerVariants} className="space-y-8">
                {section.items
                  .sort((a, b) => a.position_order - b.position_order)
                  .map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <SectionItem item={item} />
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </div>
        </motion.section>
      ))}
    </div>
  );
};

const SectionItem = ({ item }: { item: any }) => {
  const { item_type, content } = item;

  const getAlignment = () => {
    switch (content.alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const getStyle = () => ({
    fontSize: content.fontSize || '16px',
    fontWeight: content.fontWeight || '400',
    color: content.color || 'inherit',
    backgroundColor: content.backgroundColor !== 'transparent' ? content.backgroundColor : undefined,
    padding: content.backgroundColor !== 'transparent' ? '0.5rem' : undefined,
    borderRadius: content.backgroundColor !== 'transparent' ? '0.25rem' : undefined
  });

  switch (item_type) {
    case 'text':
      return (
        <div className={getAlignment()}>
          <p style={getStyle()}>
            {content.text}
          </p>
        </div>
      );

    case 'image':
      return (
        <div className="flex justify-center">
          <img
            src={content.imageUrl}
            alt="Section content"
            className="max-w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: '400px' }}
          />
        </div>
      );

    case 'button':
      return (
        <div className={getAlignment()}>
          <a
            href={content.linkUrl || '#'}
            className="inline-block px-6 py-3 rounded-md font-medium transition-all duration-300 hover:opacity-90"
            style={{
              color: content.color || '#ffffff',
              backgroundColor: content.backgroundColor || '#0EA5E9',
              textDecoration: 'none'
            }}
          >
            {content.buttonText || 'Кнопка'}
          </a>
        </div>
      );

    case 'link':
      return (
        <div className={getAlignment()}>
          <a
            href={content.linkUrl || '#'}
            className="inline-block hover:underline transition-all duration-300"
            style={{
              color: content.color || '#0EA5E9',
              fontSize: content.fontSize || '16px',
              fontWeight: content.fontWeight || '400'
            }}
          >
            {content.text || 'Ссылка'}
          </a>
        </div>
      );

    default:
      return null;
  }
};

export default DynamicSections;