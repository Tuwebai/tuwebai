import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TUWEBAI_WHATSAPP_NUMBER } from '@/shared/constants/contact';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  showPopup?: boolean;
  delay?: number;
}

export default function WhatsAppButton({
  phone = TUWEBAI_WHATSAPP_NUMBER,
  message = "Hola, estoy interesado en sus servicios de desarrollo web",
  showPopup = true,
  delay = 3000
}: WhatsAppButtonProps) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showPopup && isButtonVisible) {
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [showPopup, isButtonVisible, delay]);

  return (
    <>
      <AnimatePresence>
        {isButtonVisible && (
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <AnimatePresence>
              {isPopupVisible && (
                <motion.div
                  className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-3 max-w-xs w-64"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setIsPopupVisible(false)}
                    aria-label="Cerrar popup"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">¿Necesitas ayuda?</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Contáctanos por WhatsApp y te responderemos a la brevedad.</p>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => setIsPopupVisible(false)}
                      className="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Más tarde
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-1.5 text-xs bg-[#25D366] text-white rounded-md hover:bg-[#20b959] transition-colors text-center"
                    >
                      Chatear ahora
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#25D366] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPopupVisible(false)}
              onMouseEnter={() => !isPopupVisible && setIsPopupVisible(true)}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              aria-label="Contactar por WhatsApp"
            >
              <WhatsAppIcon className="w-7 h-7" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
