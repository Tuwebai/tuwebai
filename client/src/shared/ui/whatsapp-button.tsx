import { useEffect, useState } from 'react';

import analytics from '@/lib/analytics';
import { TUWEBAI_WHATSAPP_NUMBER } from '@/shared/constants/contact';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  showPopup?: boolean;
  delay?: number;
  hideOnMobile?: boolean;
}

export default function WhatsAppButton({
  phone = TUWEBAI_WHATSAPP_NUMBER,
  message = 'Hola, estoy interesado en sus servicios de desarrollo web',
  showPopup = true,
  delay = 3000,
  hideOnMobile = false,
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
    if (!showPopup || !isButtonVisible) {
      return;
    }

    const timer = setTimeout(() => {
      setIsPopupVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [showPopup, isButtonVisible, delay]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 transition-all duration-500 ease-out sm:bottom-6 sm:right-6 ${
        isButtonVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-90 opacity-0'
      } ${hideOnMobile ? 'hidden md:block' : ''}`}
    >
      <div
        className={`absolute bottom-16 right-0 mb-3 w-[min(16rem,calc(100vw-2rem))] max-w-xs rounded-lg bg-white p-3 shadow-lg transition-all duration-200 ease-out dark:bg-gray-800 sm:w-64 sm:p-4 ${
          isPopupVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-3 scale-95 opacity-0'
        }`}
      >
        <button
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={() => setIsPopupVisible(false)}
          aria-label="Cerrar popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <WhatsAppIcon className="h-8 w-8 text-[#25D366]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Necesitas ayuda?</h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Contactanos por WhatsApp y te responderemos a la brevedad.
            </p>
          </div>
        </div>

        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => setIsPopupVisible(false)}
            className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Mas tarde
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.trackOutboundClick(whatsappUrl, 'floating_whatsapp_popup', 'Chatear ahora', 'whatsapp')}
            className="flex-1 rounded-md bg-[#25D366] px-3 py-1.5 text-center text-xs text-white transition-colors hover:bg-[#20b959]"
          >
            Chatear ahora
          </a>
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 ease-out hover:scale-110 hover:shadow-xl active:scale-95 sm:h-14 sm:w-14"
        onClick={() => {
          analytics.trackCtaClick('floating_whatsapp', 'floating_button', whatsappUrl);
          analytics.trackOutboundClick(whatsappUrl, 'floating_button', 'WhatsApp flotante', 'whatsapp');
          setIsPopupVisible(false);
        }}
        onMouseEnter={() => !isPopupVisible && setIsPopupVisible(true)}
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </div>
  );
}
