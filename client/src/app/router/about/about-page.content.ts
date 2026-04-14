import {
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_SITE_FULL_URL,
} from '@/shared/constants/contact';

type FeaturedProject = {
  title: string;
  category: string;
  description: string;
  stack: string[];
  image: string;
  href: string;
  badge?: string;
};

export const STORY_PARAGRAPHS = [
  'TuWebAI arranc? en 2020. No con un plan de negocios ni con inversores. Arranc? con una computadora, ganas de construir cosas que funcionen y la certeza de que el desarrollo web en Argentina estaba mal enfocado.',
  'Hab?a demasiadas agencias haciendo webs bonitas que no convert?an nada. Demasiados clientes pagando por sitios que nadie usaba. Demasiado foco en el dise?o y cero en el negocio detr?s del dise?o.',
  'Decidimos trabajar distinto: entender primero qu? necesita el negocio, construir despu?s. Sin templates, sin atajos, sin promesas que no podemos cumplir. Casi 6 a?os despu?s, esa sigue siendo la ?nica regla.',
] as const;

export const CONTEXT_STATS = [
  { value: '2020', label: 'Fundaci?n' },
  { value: '6', label: 'A?os construyendo' },
  { value: '3', label: 'Productos propios en producci?n' },
] as const;

export const PRINCIPLES = [
  {
    title: 'Honestidad antes que venta',
    description:
      'Si tu proyecto no encaja con lo que hacemos, te lo decimos antes de arrancar. Preferimos perder un cliente hoy que generarle un problema ma?ana.',
  },
  {
    title: 'C?digo, no atajos',
    description:
      'Ning?n proyecto de TuWebAI usa page builders, templates comprados ni WordPress mal configurado. Lo que construimos es c?digo real, tuyo y mantenible.',
  },
  {
    title: 'Resultados medibles',
    description:
      'Una web que no genera consultas no es una inversi?n, es un costo. Por eso cada proyecto arranca definiendo qu? tiene que lograr y c?mo vamos a medirlo.',
  },
] as const;

export const STACK_CHIPS = ['React', 'Node.js', 'Supabase', 'PostgreSQL', 'Tailwind'] as const;

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    title: 'LH Decants',
    category: 'E-commerce',
    description:
      'Tienda de decants con cat?logo por mililitro, checkout con MercadoPago y panel de stock propio.',
    stack: ['React', 'Node.js', 'MercadoPago'],
    image: '/lhdecant-card.webp',
    href: 'https://lhdecant.com/',
    badge: 'Cliente',
  },
  {
    title: 'SafeSpot',
    category: 'Seguridad',
    description:
      'Plataforma colaborativa con alertas, reportes geolocalizados y seguimiento comunitario en tiempo real.',
    stack: ['React', 'Supabase', 'Mapas'],
    image: '/safespot.webp',
    href: 'https://safespot.tuweb-ai.com/',
  },
  {
    title: 'Captiva',
    category: 'Landing Pages',
    description:
      'Sistema de demos y landings orientadas a conversi?n para negocios locales con propuesta comercial clara.',
    stack: ['React', 'Tailwind', 'Vite'],
    image: '/captiva.png',
    href: 'https://captiva.tuweb-ai.com/captiva',
  },
] as const;

export const ABOUT_PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/nosotros`;

export const ABOUT_PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Juan Esteban L?pez Pachao',
  alternateName: ['Juanchi', 'Juanchi L?pez', 'Juanchi Dev', 'juanchiidev'],
  jobTitle: 'Fundador y Desarrollador Fullstack',
  worksFor: {
    '@type': 'Organization',
    name: 'TuWebAI',
    url: TUWEBAI_SITE_FULL_URL,
  },
  url: ABOUT_PAGE_URL,
  sameAs: [TUWEBAI_LINKEDIN_URL],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'R?o Tercero',
    addressRegion: 'C?rdoba',
    addressCountry: 'AR',
  },
  knowsAbout: [
    'Desarrollo web',
    'React',
    'Node.js',
    'Supabase',
    'PostgreSQL',
    'Tailwind CSS',
    'SEO t?cnico',
    'E-commerce Argentina',
    'MercadoPago',
  ],
};
