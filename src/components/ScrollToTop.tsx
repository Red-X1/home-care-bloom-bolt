import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return <AnimatePresence>
      {isVisible && <motion.div initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0.8
    }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button onClick={scrollToTop} aria-label="Прокрутить наверх" className="bg-brand-pink hover:bg-brand-pink/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col items-center py-[12px] mx-0 my-[60px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-xs whitespace-nowrap">Наверх</span>
          </button>
        </motion.div>}
    </AnimatePresence>;
};
export default ScrollToTop;