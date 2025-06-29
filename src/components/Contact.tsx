import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1
  });
  
  const { contactContent } = useSiteContent();

  // Fallback content if database content is not available
  const content = contactContent || {
    title: "Остались вопросы?",
    subtitle: "Свяжитесь с нами, и мы с удовольствием ответим на все ваши вопросы о нашей продукции и компании.",
    address: "ул. Чистая, д. 10, Москва, 123456",
    phone: "+7 (495) 123-45-67",
    email: "info@cleanhouse.ru",
    workingHours: "Пн-Пт: 9:00 - 18:00\nСб-Вс: Выходные"
  };

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

  return (
    <section id="contact" className="py-20 md:py-32 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
            transition={{ duration: 0.6 }} 
            className="section-subtitle text-[0ea5e9] text-brand-pink"
          >
            Связаться с нами
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
            transition={{ duration: 0.6, delay: 0.1 }} 
            className="section-title text-brand-dark"
          >
            {content.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {content.subtitle}
          </motion.p>
        </div>

        <motion.div 
          ref={ref} 
          variants={containerVariants} 
          initial="hidden" 
          animate={isInView ? 'visible' : 'hidden'} 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-6 text-brand-dark">Отправьте нам сообщение</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent" 
                    placeholder="Ваше имя" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent" 
                    placeholder="your@email.com" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Тема</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent" 
                  placeholder="Тема сообщения" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Сообщение</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent" 
                  placeholder="Ваше сообщение..."
                ></textarea>
              </div>
              <div>
                <button 
                  type="submit" 
                  className="w-full rounded-md bg-brand-pink hover:bg-brand-pink/90 py-3 text-md font-medium text-white transition-colors"
                >
                  Отправить сообщение
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-6 text-brand-dark">Контактная информация</h3>
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-brand-pink mb-1">Адрес</p>
                <p className="text-lg text-gray-800">{content.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-pink mb-1">Телефон</p>
                <p className="text-lg text-gray-800">{content.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-pink mb-1">Email</p>
                <p className="text-lg text-gray-800">{content.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-pink mb-1">Рабочие часы</p>
                {content.workingHours.split('\n').map((line, index) => (
                  <p key={index} className="text-lg text-gray-800">{line}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;