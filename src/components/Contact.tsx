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
  const {
    contactContent
  } = useSiteContent();

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
  return <section id="contact" className="py-20 md:py-32 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
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
        }} className="section-subtitle text-[0ea5e9] text-brand-pink">
            Связаться с нами
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
            {content.subtitle}
          </motion.p>
        </div>

        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-6 text-brand-dark">Отправьте нам сообщение</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input type="text" id="name" name="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent" placeholder="Ваше имя" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Тема</label>
                <input type="text" id="subject" name="subject" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent" placeholder="Тема сообщения" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Сообщение</label>
                <textarea id="message" name="message" rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent" placeholder="Ваше сообщение..."></textarea>
              </div>
              <div>
                <button type="submit" className="w-full rounded-md bg-brand-pink hover:bg-brand-pink/90 py-3 text-md font-medium text-white transition-colors">
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
                {content.workingHours.split('\n').map((line, index) => <p key={index} className="text-lg text-gray-800">{line}</p>)}
              </div>
            </div>
            <div className="mt-8">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-brand-pink transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand-pink transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand-pink transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195A4.92 4.92 0 0016.57 2a4.935 4.935 0 00-4.93 4.93c0 .386.035.76.13 1.126A13.98 13.98 0 013.493 3.3a4.947 4.947 0 001.526 6.57 4.9 4.9 0 01-2.23-.616v.061a4.935 4.935 0 003.942 4.835 4.95 4.95 0 01-2.217.085 4.935 4.935 0 004.604 3.417A9.884 9.884 0 010 20.289a13.93 13.93 0 007.548 2.209c9.054 0 14.004-7.5 14.004-14.001 0-.21-.005-.426-.015-.635A10.016 10.016 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand-pink transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.94v5.666h-3.56V9h3.415v1.561h.046a3.745 3.745 0 013.344-1.835c3.575 0 4.235 2.356 4.235 5.418v6.308zm-15.101-13c-1.144 0-2.066-.926-2.066-2.064 0-1.14.922-2.066 2.066-2.066 1.14 0 2.063.926 2.063 2.066 0 1.138-.924 2.064-2.063 2.064zm1.782 13h-3.564V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default Contact;