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
  comparison: null,
  showroom: null,
  pricing: null,
  impact: null,
  testimonials: null,
  contact: null,
};

export function useHomeSectionNavigation() {
  const location = useLocation();

  const sectionRefs = useRef<SectionRefMap>(DEFAULT_SECTION_REFS);

  const setSectionRef = (id: string, ref: HTMLElement | null) => {
    sectionRefs.current[id] = ref;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section');
    const hashSection = location.hash ? location.hash.substring(1) : null;
    const targetSection = hashSection || sectionParam;



    if (targetSection && HOME_SECTIONS.some((section) => section.id === targetSection)) {
      let attempts = 0;
      const maxAttempts = 12;

      const tryScrollToSection = () => {
        attempts += 1;

        const section = sectionRefs.current[targetSection];
        if (section) {
          scrollToHomeSection(section);
          return;
        }

        if (attempts < maxAttempts) {
          window.setTimeout(tryScrollToSection, 200);
        }
      };

      window.setTimeout(tryScrollToSection, 300);
    }
  }, [location]);

  return {
    sections: HOME_SECTIONS,
    setSectionRef,
  };
}
