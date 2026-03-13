import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToHomeSection } from '@/features/marketing-home/utils/scroll-to-home-section';

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
      scrollToHomeSection(section);
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
      }, 300);
    }
  }, [debugScroll, location]);

  return {
    sections: HOME_SECTIONS,
    setSectionRef,
  };
}
