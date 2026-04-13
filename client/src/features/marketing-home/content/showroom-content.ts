import type { ShowroomProject } from '@/features/marketing-home/components/showroom-types';

export const DEFAULT_SHOWROOM_CATEGORY = 'all';

export const SHOWROOM_PROJECTS: ShowroomProject[] = [
  {
    id: 1,
    title: 'LH Decants',
    category: 'e-commerce',
    description:
      'Tienda de decants con catalogo por mililitro, checkout con MercadoPago y panel de stock propio.',
    clientNeed:
      'Vender fragancias premium con una experiencia clara, elegante y confiable para usuarios que necesitan decidir sin probar el perfume fisicamente.',
    solutionSummary:
      'Diseñamos un e-commerce enfocado en confianza, catalogo premium y claridad de compra para decants 100% originales.',
    valueSummary:
      'La solucion mejora conversion, transmite autenticidad y facilita explorar una oferta exclusiva sin friccion innecesaria.',
    features: ['Decants 100% originales', 'Fragancias exclusivas del mundo', 'Preserva calidad e intensidad', 'Frascos autenticos', 'Elegancia en su forma mas pura'],
    results: [{ label: 'Satisfaccion', value: '98%' }, { label: 'Productos originales', value: '100%' }, { label: 'Fragancias', value: '+200' }],
    image: '/lhdecant-card.webp',
    detailsUrl: '/showroom',
    externalUrl: 'https://lhdecant.com/',
  },
  {
    id: 2,
    title: 'Pulse by TuWebAI',
    category: 'saas',
    description: 'Dashboard privado para clientes que ordena metricas, proyecto y soporte en una sola vista.',
    sectionLabels: {
      clientNeed: 'Que necesitaba resolver Pulse',
      solutionSummary: 'Que hace Pulse hoy',
      valueSummary: 'Que valor recibe el cliente',
    },
    clientNeed:
      'Dar a cada cliente un espacio privado para entender que esta pasando con su web, que avances siguen en curso y que decisiones siguen en agenda sin perderse en lenguaje tecnico.',
    solutionSummary:
      'Construimos Pulse como un dashboard privado con metricas claras, seguimiento del proyecto, pagos, soporte y contexto util en una misma experiencia.',
    valueSummary:
      'Pulse baja la friccion del servicio, mejora la visibilidad para el cliente y convierte el seguimiento web en algo claro, ordenado y accionable.',
    features: ['Seguimiento claro de metricas y señales del negocio', 'Estado del proyecto, soporte y notificaciones en un solo espacio', 'Acceso administrado por invitacion', 'Contexto real de cada cuenta sin lenguaje tecnico innecesario', 'Experiencia privada optimizada para escritorio y mobile'],
    results: [{ label: 'Vista unificada', value: 'Metricas + proyecto' }, { label: 'Acceso', value: 'Privado por invitacion' }, { label: 'Soporte', value: 'Contexto util' }],
    image: '/pulse-by-tuwebai.png',
    detailsUrl: '/showroom',
    externalUrl: 'https://pulse.tuweb-ai.com/',
  },
  {
    id: 3,
    title: 'SafeSpot',
    category: 'seguridad-ciudadana',
    description: 'Plataforma de reporte colaborativo de objetos robados con alertas y mapa en tiempo real.',
    clientNeed:
      'Dar a la comunidad una herramienta concreta para reportar, alertar y seguir casos de seguridad sin depender de canales fragmentados.',
    solutionSummary:
      'Creamos una plataforma web para reportes geolocalizados, alertas y seguimiento comunitario en tiempo real.',
    valueSummary:
      'La solucion mejora la velocidad de respuesta, ordena la informacion critica y fortalece la colaboracion entre usuarios.',
    features: ['Reportes de objetos robados geolocalizados', 'Busqueda por categoria, zona y descripcion', 'Alertas y notificaciones en tiempo real', 'Canal comunitario para seguimiento de casos', 'Panel administrable para moderacion y soporte'],
    results: [{ label: 'Foco', value: 'Seguridad 24/7' }, { label: 'Cobertura', value: 'Comunidad activa' }, { label: 'Objetivo', value: 'Recuperacion rapida' }],
    image: '/safespot.webp',
    detailsUrl: '/showroom',
    externalUrl: 'https://safespot.tuweb-ai.com/',
  },
  {
    id: 4,
    title: 'Trading TuWeb.ai',
    category: 'saas',
    description: 'Dashboard de trading para monitoreo de mercado, gestion de operaciones y seguimiento en tiempo real.',
    clientNeed:
      'Tomar decisiones con datos visibles y seguimiento continuo, sin dashboards confusos ni informacion fragmentada.',
    solutionSummary:
      'Desarrollamos un panel de trading con monitoreo de mercado, operaciones y rendimiento en una sola interfaz.',
    valueSummary:
      'El sistema mejora claridad operativa, velocidad de lectura y control diario sobre balances, riesgo y movimientos.',
    features: ['Panel de mercado con metricas en vivo', 'Seguimiento de operaciones y posiciones', 'Resumen de rendimiento y riesgo', 'Vista clara de balances y movimientos', 'Experiencia optimizada para toma de decisiones'],
    results: [{ label: 'Visibilidad', value: 'Tiempo real' }, { label: 'Control', value: 'Operaciones 24/7' }, { label: 'Analisis', value: 'Rendimiento continuo' }],
    image: '/trading-tuwebai.webp',
    detailsUrl: '/showroom',
    externalUrl: 'https://trading.tuweb-ai.com/',
  },
  {
    id: 5,
    title: 'Captiva',
    category: 'landing-pages',
    description: 'Sistema de generacion de demos y landing pages orientadas a conversion para negocios locales.',
    clientNeed:
      'Validar una oferta digital con una pagina enfocada en captar leads calificados sin distracciones ni navegacion innecesaria.',
    solutionSummary:
      'Desarrollamos una landing page de conversion con propuesta de valor directa, estructura comercial y CTA visibles desde el primer scroll.',
    valueSummary:
      'La solucion ayuda a comunicar mejor la oferta, reducir friccion en la decision y transformar visitas en consultas concretas.',
    features: ['Hero con propuesta de valor clara', 'CTA visibles en los puntos criticos', 'Secciones pensadas para objeciones y confianza', 'Diseño mobile-first enfocado en conversion', 'Landing lista para campañas y trafico pago'],
    results: [{ label: 'Formato', value: 'Landing' }, { label: 'Objetivo', value: 'Mas leads' }, { label: 'Enfoque', value: 'Conversion' }],
    image: '/captiva.png',
    detailsUrl: '/showroom',
    externalUrl: 'https://captiva.tuweb-ai.com/captiva',
  },
  {
    id: 6,
    title: 'Instadetox',
    category: 'experimental',
    description: 'Experimento para validar una idea digital: propuesta simple, visual y directa al usuario.',
    clientNeed:
      'Probar una hipotesis de producto con una experiencia rapida de lanzar, facil de entender y lista para medir respuesta real.',
    solutionSummary:
      'Construimos una landing experimental con narrativa breve, foco visual y estructura minima para testear interes sin sobrecargar la experiencia.',
    valueSummary:
      'El proyecto permite iterar rapido, validar mensaje y detectar si la idea genera atencion antes de invertir en una plataforma mayor.',
    features: ['Enfoque experimental de validacion rapida', 'Narrativa breve y visual', 'Estructura simple para medir interes', 'Experiencia optimizada para mobile', 'Base liviana para iterar nuevas versiones'],
    results: [{ label: 'Tipo', value: 'Experimental' }, { label: 'Objetivo', value: 'Validacion' }, { label: 'Velocidad', value: 'Iteracion rapida' }],
    image: '/instadetox.png',
    detailsUrl: '/showroom',
    externalUrl: 'https://instadetox.netlify.app/',
  },
];

export const SHOWROOM_CATEGORY_NAMES: Record<string, string> = {
  all: 'Todos',
  'e-commerce': 'E-commerce',
  'landing-pages': 'Landing Pages',
  saas: 'SaaS',
  experimental: 'Experimental',
  'seguridad-ciudadana': 'Seguridad',
};
