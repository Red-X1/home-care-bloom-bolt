
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionItem {
  id: number;
  item_type: string;
  content: any;
  text_color: string;
  font_family: string;
  font_weight: string;
  font_size: string;
}

interface DynamicSectionProps {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  background_color: string;
  text_color: string;
  font_family: string;
  font_weight: string;
  font_size: string;
  items?: SectionItem[];
}

const DynamicSection = ({ 
  title, 
  subtitle, 
  description, 
  background_color, 
  text_color, 
  font_family, 
  font_weight, 
  font_size, 
  items = [] 
}: DynamicSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1
  });

  const getFontSizeClass = (size: string) => {
    const sizeMap: Record<string, string> = {
      'xs': 'text-xs',
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl'
    };
    return sizeMap[size] || 'text-base';
  };

  const getFontWeightClass = (weight: string) => {
    const weightMap: Record<string, string> = {
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold'
    };
    return weightMap[weight] || 'font-normal';
  };

  const renderItem = (item: SectionItem) => {
    const itemStyle = {
      color: item.text_color,
      fontFamily: item.font_family,
      fontWeight: item.font_weight
    };

    const itemClasses = `${getFontSizeClass(item.font_size)} ${getFontWeightClass(item.font_weight)}`;

    switch (item.item_type) {
      case 'text':
        return (
          <div key={item.id} className={itemClasses} style={itemStyle}>
            {item.content.text}
          </div>
        );
      case 'image':
        return (
          <img
            key={item.id}
            src={item.content.url}
            alt={item.content.alt || ''}
            className="max-w-full h-auto rounded-lg"
          />
        );
      case 'button':
        return (
          <a
            key={item.id}
            href={item.content.link}
            className={`inline-block px-6 py-3 rounded-lg transition-colors hover:opacity-90 ${itemClasses}`}
            style={{ 
              ...itemStyle, 
              backgroundColor: item.text_color, 
              color: background_color 
            }}
          >
            {item.content.text}
          </a>
        );
      case 'link':
        return (
          <a
            key={item.id}
            href={item.content.url}
            className={`underline hover:no-underline transition-colors ${itemClasses}`}
            style={itemStyle}
          >
            {item.content.text}
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      className="py-20 md:py-32"
      style={{ backgroundColor: background_color }}
    >
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {subtitle && (
            <p 
              className={`section-subtitle mb-2 ${getFontSizeClass('sm')} ${getFontWeightClass('500')}`}
              style={{ 
                color: text_color, 
                fontFamily: font_family,
                opacity: 0.8
              }}
            >
              {subtitle}
            </p>
          )}
          <h2 
            className={`section-title ${getFontSizeClass(font_size)} ${getFontWeightClass(font_weight)}`}
            style={{ 
              color: text_color, 
              fontFamily: font_family 
            }}
          >
            {title}
          </h2>
          {description && (
            <p 
              className={`max-w-2xl mx-auto ${getFontSizeClass('lg')} ${getFontWeightClass('400')}`}
              style={{ 
                color: text_color, 
                fontFamily: font_family,
                opacity: 0.9
              }}
            >
              {description}
            </p>
          )}
        </motion.div>

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {items.map(renderItem)}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DynamicSection;
