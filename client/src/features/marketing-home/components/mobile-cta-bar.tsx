import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { trackRuntimeCtaClick, trackRuntimeOutboundClick } from '@/lib/analytics-runtime';
import { TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';

export default function MobileCtaBar() {
  const [isVisible, setIsVisible] = useState(false);
  const whatsappUrl = useMemo(
    () =>
      `${TUWEBAI_WHATSAPP_URL}?text=${encodeURIComponent(
        'Hola, quiero contarles mi proyecto y entender si TuWebAI es para mi negocio.',
      )}`,
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      const viewportWidth = window.innerWidth;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      setIsVisible(viewportWidth < 768 && scrollProgress >= 0.3);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2 transition-all duration-300 md:hidden ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="editorial-floating-surface mx-auto flex max-w-md items-center gap-3 p-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackRuntimeCtaClick('whatsapp_mobile_sticky', 'mobile_cta_bar', whatsappUrl);
            trackRuntimeOutboundClick(
              whatsappUrl,
              'mobile_cta_bar',
              'WhatsApp sticky mobile',
              'whatsapp',
            );
          }}
          className="editorial-secondary-button min-h-12 flex-1 px-4 py-3 text-sm font-semibold text-[var(--signal)]"
        >
          WhatsApp
        </a>

        <Link
          to="/consulta"
          onClick={() => trackRuntimeCtaClick('contar_proyecto_mobile_sticky', 'mobile_cta_bar', '/consulta')}
          className="inline-flex min-h-12 flex-[1.2] items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]"
        >
          Contar mi proyecto
        </Link>
      </div>
    </div>
  );
}
