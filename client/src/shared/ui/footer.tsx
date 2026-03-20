import { Suspense, lazy } from 'react';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import { TUWEBAI_EMAIL, TUWEBAI_SITE_FULL_URL, TUWEBAI_SITE_URL } from '@/shared/constants/contact';

const NewsletterForm = lazy(() => import('@/features/newsletter/components/newsletter-form'));

function DeferredFooterNewsletter() {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '320px 0px',
  });

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#9BE7FF]">Newsletter</p>
      <p className="mb-3 text-xs leading-6 text-gray-400">Recibi nuevas publicaciones y analisis de conversion.</p>

      {hasIntersected ? (
        <Suspense fallback={<div className="h-[74px] w-full rounded-lg border border-white/10 bg-[#0a0a0f]/40" />}>
          <NewsletterForm
            source="footer"
            className="text-xs"
            buttonText="Sumarme"
            inputPlaceholder="Tu email"
            disclaimerClassName="text-gray-500"
          />
        </Suspense>
      ) : (
        <div className="h-[74px] w-full rounded-lg border border-white/10 bg-[#0a0a0f]/40" />
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 animate-fadeIn border-t border-gray-800 bg-[#0a0a0f] pb-8 pt-10 text-sm text-gray-400 sm:pt-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="mb-10 grid gap-8 sm:gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h3 className="mb-4 font-rajdhani text-lg font-bold text-white">TuWeb.ai</h3>
            <p className="mb-4">Creando experiencias web inteligentes para marcas que buscan destacar en el entorno digital.</p>
            <DeferredFooterNewsletter />
          </div>

          <div>
            <h3 className="mb-4 font-rajdhani text-lg font-bold text-white">Servicios</h3>
            <ul className="space-y-2">
              <li><a href="/servicios/desarrollo-web" className="transition-colors hover:text-[#00CCFF]">Desarrollo Web</a></li>
              <li><a href="/contacto" className="transition-colors hover:text-[#00CCFF]">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-rajdhani text-lg font-bold text-white">Enlaces rapidos</h3>
            <ul className="space-y-2">
              <li><a href="/faq" className="transition-colors hover:text-[#9933FF]">Preguntas Frecuentes</a></li>
              <li><a href="/blog/" className="transition-colors hover:text-[#9933FF]">Blog</a></li>
              <li><a href="/contacto" className="transition-colors hover:text-[#9933FF]">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-rajdhani text-lg font-bold text-white">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-gray-300">Email:</p>
                  <a href={`mailto:${TUWEBAI_EMAIL}`} className="transition-colors hover:text-[#00CCFF]">{TUWEBAI_EMAIL}</a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 text-[#9933FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <p className="text-gray-300">Web:</p>
                  <a
                    href={TUWEBAI_SITE_FULL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#9933FF]"
                  >
                    {TUWEBAI_SITE_URL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row md:gap-6">
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
            <img src="/logo-tuwebai.png" alt="Logo TuWeb.ai" className="h-8 w-8" />
            <span className="text-sm text-gray-400">© 2024 TuWeb.ai. Todos los derechos reservados.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-center md:justify-end">
            <a href="/terminos-condiciones" className="transition-colors hover:text-[#9933FF]">Terminos y condiciones</a>
            <a href="/politica-privacidad" className="transition-colors hover:text-[#00CCFF]">Politica de privacidad</a>
            <a href="/politica-cookies" className="transition-colors hover:text-[#00CCFF]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
