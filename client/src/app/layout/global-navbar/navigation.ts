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
      { id: 'intro', label: 'Introduccion' },
      { id: 'philosophy', label: 'Filosofia' },
      { id: 'services', label: 'Servicios' },
      { id: 'process', label: 'Proceso' },
      { id: 'showroom', label: 'Proyectos' },
    ],
  },
  { name: 'Corporativos', href: '/corporativos' },
  {
    name: 'UX/UI',
    href: '/uxui',
    sections: [
      { id: 'servicios', label: 'Servicios UX/UI' },
      { id: 'procesos', label: 'Proceso de diseno' },
      { id: 'proyectos', label: 'Proyectos destacados' },
      { id: 'contacto', label: 'Contacto' },
    ],
  },
  { name: 'E-commerce', href: '/ecommerce' },
  { name: 'Blog', href: '/blog' },
  {
    name: 'Tecnologias',
    href: '/tecnologias',
    sections: [
      { id: 'frontend', label: 'Frontend' },
      { id: 'backend', label: 'Backend' },
      { id: 'cms', label: 'CMS' },
      { id: 'ecommerce', label: 'E-commerce' },
      { id: 'design', label: 'Diseno' },
    ],
  },
  { name: 'FAQ', href: '/faq' },
];

export const shouldUseAuthenticatedNavbar = (pathname: string) =>
  pathname.startsWith('/panel') || pathname.startsWith('/auth/');

export const prefetchNavigationPath = (path: string) => {
  prefetchRoute(path);
};
