import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export interface HomeSectionItem {
  id: string;
  label: string;
}

export const HOME_SECTIONS: HomeSectionItem[] = [
  { id: 'intro', label: 'Introducción' },
  { id: 'philosophy', label: 'Filosofía' },
  { id: 'services', label: 'Servicios' },
  { id: 'process', label: 'Proceso' },
  { id: 'tech', label: 'Tecnologías' },
  { id: 'comparison', label: 'Comparativa' },
  { id: 'showroom', label: 'Proyectos' },
  { id: 'pricing', label: 'Planes' },
  { id: 'impact', label: 'Impacto' },
  { id: 'testimonials', label: 'Testimonios' },
  { id: 'contact', label: 'Contacto' },
];

type SectionRefMap = Record<string, HTMLElement | null>;

const DEFAULT_SECTION_REFS: SectionRefMap = {
  intro: null,
  philosophy: null,
  services: null,
  process: null,
  tech: null,
  comparison: null,
  showroom: null,
  pricing: null,
  impact: null,
  testimonials: null,
  contact: null,
};

export function useHomeSectionNavigation() {
  const location = useLocation();
  const debugScroll = import.meta.env.DEV;
  const sectionRefs = useRef<SectionRefMap>(DEFAULT_SECTION_REFS);

  const setSectionRef = (id: string, ref: HTMLElement | null) => {
    sectionRefs.current[id] = ref;
  };

  const scrollToSection = (sectionId: string) => {
    if (debugScroll) console.debug('Intentando desplazarse a la sección:', sectionId);

    const section = sectionRefs.current[sectionId];
    if (section) {
      if (debugScroll) console.debug('Sección encontrada, desplazándose...');
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth',
      });
    } else if (debugScroll) {
      console.debug('Sección no encontrada en refs:', Object.keys(sectionRefs.current));
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section');
    const hashSection = location.hash ? location.hash.substring(1) : null;
    const targetSection = hashSection || sectionParam;

    if (debugScroll) console.debug('Intentando navegar a sección:', targetSection);

    if (targetSection && HOME_SECTIONS.some((section) => section.id === targetSection)) {
      setTimeout(() => {
        if (debugScroll) console.debug('Intentando scroll a sección:', targetSection);
        scrollToSection(targetSection);

        setTimeout(() => {
          const section = document.getElementById(targetSection);
          if (section) {
            if (debugScroll) console.debug('Usando método alternativo de scroll');

            const headerOffset = 100;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });

            setTimeout(() => {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          } else if (debugScroll) {
            console.debug('Elemento no encontrado con ID:', targetSection);
          }
        }, 100);
      }, 300);
    }
  }, [debugScroll, location]);

  return {
    sections: HOME_SECTIONS,
    setSectionRef,
  };
}
