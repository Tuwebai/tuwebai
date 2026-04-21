import { Suspense, lazy } from 'react';
import { Github, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import { trackRuntimeOutboundClick } from '@/lib/analytics-runtime';
import {
  TUWEBAI_CAPTIVA_URL,
  TUWEBAI_EMAIL,
  TUWEBAI_GITHUB_URL,
  TUWEBAI_INSTAGRAM_URL,
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_LOCATION,
  TUWEBAI_WHATSAPP_DISPLAY,
  TUWEBAI_WHATSAPP_TEL,
} from '@/shared/constants/contact';

const NewsletterForm = lazy(() => import('@/features/newsletter/components/newsletter-form'));

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const footerColumns: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: 'Servicios',
    links: [
      { label: 'Captiva', href: TUWEBAI_CAPTIVA_URL, external: true },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Proceso', href: '/proceso' },
      { label: 'Casos de éxito', href: '/?section=showroom' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Diagnóstico gratuito', href: '/diagnostico-gratuito' },
      { label: 'Checklist web gratuito de 35 puntos →', href: '/checklist-web-gratis' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/politica-privacidad' },
      { label: 'Términos', href: '/terminos-condiciones' },
      { label: 'Cookies', href: '/politica-cookies' },
    ],
  },
];

function FooterNavLink({ link }: { link: FooterLink }) {
  const className = 'transition-colors hover:text-white';

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => trackRuntimeOutboundClick(link.href, 'footer', link.label, 'external_link')}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.href} className={className}>
      {link.label}
    </Link>
  );
}

function DeferredFooterNewsletter() {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '320px 0px',
  });

  return (
    <div
      ref={ref}
      className="w-full max-w-[420px] justify-self-start rounded-[28px] border border-white/8 bg-white/5 p-5 shadow-[0_18px_40px_rgba(2,6,23,0.24)] backdrop-blur lg:justify-self-end"
    >
      <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#C4B5FD]">Newsletter</p>
      <p className="mb-4 text-sm leading-6 text-gray-400">
        Recibí publicaciones, análisis y recursos concretos sobre conversión web para negocios en Argentina.
      </p>

      {hasIntersected ? (
        <Suspense
          fallback={<div className="h-[74px] w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)]/60" />}
        >
          <NewsletterForm
            source="footer"
            className="w-full"
            buttonText="Sumarme"
            inputPlaceholder="Tu email"
            disclaimerClassName="text-left text-gray-500"
          />
        </Suspense>
      ) : (
        <div className="h-[74px] w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)]/60" />
      )}
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 animate-fadeIn border-t border-white/5 bg-[var(--bg-overlay)] pb-8 pt-10 text-sm text-[var(--text-secondary)] sm:pt-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="mb-10 grid gap-8 border-b border-white/5 pb-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)] lg:items-start">
          <div className="max-w-2xl">
            <h3 className="mb-4 inline-flex items-center gap-2 text-2xl font-black tracking-tight text-white">
              <span>TuWeb</span>
              <span className="text-[var(--signal)]">.ai</span>
              <span className="animate-pulse-glow h-2.5 w-2.5 rounded-full bg-[var(--signal)]" />
            </h3>
            <p className="max-w-xl text-base leading-7 text-gray-500">
              Desarrollo web profesional para negocios argentinos que quieren vender online.
            </p>

            <div className="mt-6 space-y-3 text-sm text-gray-300">
              <p>{TUWEBAI_LOCATION}</p>
              <p>
                <a
                  href={`mailto:${TUWEBAI_EMAIL}`}
                  className="transition-colors hover:text-white"
                  onClick={() =>
                    trackRuntimeOutboundClick(`mailto:${TUWEBAI_EMAIL}`, 'footer', TUWEBAI_EMAIL, 'email')
                  }
                >
                  {TUWEBAI_EMAIL}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${TUWEBAI_WHATSAPP_TEL}`}
                  className="transition-colors hover:text-white"
                  onClick={() =>
                    trackRuntimeOutboundClick(`tel:${TUWEBAI_WHATSAPP_TEL}`, 'footer', TUWEBAI_WHATSAPP_DISPLAY, 'phone')
                  }
                >
                  {TUWEBAI_WHATSAPP_DISPLAY}
                </a>
              </p>
            </div>
          </div>

          <DeferredFooterNewsletter />
        </div>

        <div className="grid gap-8 border-b border-white/5 py-10 sm:grid-cols-2 xl:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-lg font-semibold uppercase tracking-[0.12em] text-white">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterNavLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-t border-transparent pt-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              © {currentYear} TuWebAI · Desarrollo web profesional
            </p>
            <p className="text-xs text-gray-600">Hecho en Córdoba, Argentina</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-[var(--text-primary)]">
            <a
              href={TUWEBAI_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 transition-colors hover:border-[var(--signal-border)] hover:bg-[var(--signal-glow)] hover:text-white"
              onClick={() => trackRuntimeOutboundClick(TUWEBAI_LINKEDIN_URL, 'footer', 'LinkedIn', 'social')}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={TUWEBAI_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 transition-colors hover:border-[var(--signal-border)] hover:bg-[var(--signal-glow)] hover:text-white"
              onClick={() => trackRuntimeOutboundClick(TUWEBAI_INSTAGRAM_URL, 'footer', 'Instagram', 'social')}
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={TUWEBAI_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 transition-colors hover:border-[var(--signal-border)] hover:bg-[var(--signal-glow)] hover:text-white"
              onClick={() => trackRuntimeOutboundClick(TUWEBAI_GITHUB_URL, 'footer', 'GitHub', 'social')}
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
