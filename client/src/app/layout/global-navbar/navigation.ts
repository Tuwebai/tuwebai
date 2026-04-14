import { prefetchRoute } from '@/lib/route-prefetch';

export interface NavigationLink {
  name: string;
  href: string;
  sections?: { id: string; label: string }[];
}

export const MAIN_NAVIGATION: NavigationLink[] = [
  {
    name: 'Inicio',
    href: '/',
    sections: [
      { id: 'intro', label: 'Introducción' },
      { id: 'philosophy', label: 'Filosofía' },
      { id: 'services', label: 'Servicios' },
      { id: 'process', label: 'Proceso' },
      { id: 'showroom', label: 'Proyectos' },
      { id: 'impact', label: 'Diferenciales' },
      { id: 'contact', label: 'Contacto' },
    ],
  },
  {
    name: 'UX/UI',
    href: '/uxui',
    sections: [
      { id: 'servicios', label: 'Servicios UX/UI' },
      { id: 'procesos', label: 'Proceso de diseño' },
      { id: 'proyectos', label: 'Proyectos destacados' },
      { id: 'contacto', label: 'Contacto' },
    ],
  },
  { name: 'Blog', href: '/blog/' },
  { name: 'FAQ', href: '/faq' },
];

export const shouldUseAuthenticatedNavbar = (pathname: string) =>
  pathname.startsWith('/panel') || pathname.startsWith('/auth/');

export const prefetchNavigationPath = (path: string) => {
  prefetchRoute(path);
};
