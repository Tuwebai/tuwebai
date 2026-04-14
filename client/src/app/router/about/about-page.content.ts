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
  'TuWebAI arrancó en 2020. No con un plan de negocios ni con inversores. Arrancó con una computadora, ganas de construir cosas que funcionen y la certeza de que el desarrollo web en Argentina estaba mal enfocado.',
  'Habí­a demasiadas agencias haciendo webs bonitas que no convertían nada. Demasiados clientes pagando por sitios que nadie usaba. Demasiado foco en el diseño y cero en el negocio detrás del diseño.',
  'Decidimos trabajar distinto: entender primero qué necesita el negocio, construir después. Sin templates, sin atajos, sin promesas que no podemos cumplir. Casi 6 años después, esa sigue siendo la única regla.',
] as const;

export const CONTEXT_STATS = [
  { value: '2020', label: 'Fundación' },
  { value: '6', label: 'años construyendo' },
  { value: '3', label: 'Productos propios en producción' },
] as const;

export const PRINCIPLES = [
  {
    title: 'Honestidad antes que venta',
    description:
      'Si tu proyecto no encaja con lo que hacemos, te lo decimos antes de arrancar. Preferimos perder un cliente hoy que generarle un problema mañana.',
  },
  {
    title: 'Código, no atajos',
    description:
      'Ningún proyecto de TuWebAI usa page builders, templates comprados ni WordPress mal configurado. Lo que construimos es código real, tuyo y mantenible.',
  },
  {
    title: 'Resultados medibles',
    description:
      'Una web que no genera consultas no es una inversión, es un costo. Por eso cada proyecto arranca definiendo qué tiene que lograr y cómo vamos a medirlo.',
  },
] as const;

export const STACK_CHIPS = ['React', 'Node.js', 'Supabase', 'PostgreSQL', 'Tailwind'] as const;

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    title: 'LH Decants',
    category: 'E-commerce',
    description:
      'Tienda de decants con catálogo por mililitro, checkout con MercadoPago y panel de stock propio.',
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
      'Sistema de demos y landings orientadas a conversión para negocios locales con propuesta comercial clara.',
    stack: ['React', 'Tailwind', 'Vite'],
    image: '/captiva.png',
    href: 'https://captiva.tuweb-ai.com/captiva',
  },
] as const;

export const ABOUT_PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/nosotros`;

export const ABOUT_PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Juan Esteban López Pachao',
  alternateName: ['Juanchi', 'Juanchi López', 'Juanchi Dev', 'juanchiidev'],
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
    addressLocality: 'Río Tercero',
    addressRegion: 'Córdoba',
    addressCountry: 'AR',
  },
  knowsAbout: [
    'Desarrollo web',
    'React',
    'Node.js',
    'Supabase',
    'PostgreSQL',
    'Tailwind CSS',
    'SEO técnico',
    'E-commerce Argentina',
    'MercadoPago',
  ],
};
