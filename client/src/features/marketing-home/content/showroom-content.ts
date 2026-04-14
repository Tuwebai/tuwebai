import type { ShowroomProject } from '@/features/marketing-home/components/showroom-types';

export const DEFAULT_SHOWROOM_CATEGORY = 'all';

export const SHOWROOM_PROJECTS: ShowroomProject[] = [
  {
    id: 1,
    title: 'LH Decants',
    category: 'e-commerce',
    description:
      'Tienda de decants con catálogo por mililitro, checkout con MercadoPago y panel de stock propio.',
    clientNeed:
      'Vender fragancias premium con una experiencia clara, elegante y confiable para usuarios que necesitan decidir sin probar el perfume físicamente.',
    solutionSummary:
      'Diseñamos un e-commerce enfocado en confianza, catálogo premium y claridad de compra para decants 100% originales.',
    valueSummary:
      'La solución mejora conversión, transmite autenticidad y facilita explorar una oferta exclusiva sin fricción innecesaria.',
    features: ['Decants 100% originales', 'Fragancias exclusivas del mundo', 'Preserva calidad e intensidad', 'Frascos auténticos', 'Elegancia en su forma más pura'],
    results: [{ label: 'Satisfacción', value: '98%' }, { label: 'Productos originales', value: '100%' }, { label: 'Fragancias', value: '+200' }],
    image: '/lhdecant-card.webp',
    detailsUrl: '/showroom',
    externalUrl: 'https://lhdecant.com/',
  },
  {
    id: 2,
    title: 'Pulse by TuWebAI',
    category: 'saas',
    description: 'Dashboard privado para clientes que ordena métricas, proyecto y soporte en una sola vista.',
    sectionLabels: {
      clientNeed: 'Qu? necesitaba resolver Pulse',
      solutionSummary: 'Qu? hace Pulse hoy',
      valueSummary: 'Qu? valor recibe el cliente',
    },
    clientNeed:
      'Dar a cada cliente un espacio privado para entender qué está pasando con su web, qué avances siguen en curso y qué decisiones siguen en agenda sin perderse en lenguaje técnico.',
    solutionSummary:
      'Construimos Pulse como un dashboard privado con métricas claras, seguimiento del proyecto, pagos, soporte y contexto útil en una misma experiencia.',
    valueSummary:
      'Pulse baja la fricción del servicio, mejora la visibilidad para el cliente y convierte el seguimiento web en algo claro, ordenado y accionable.',
    features: ['Seguimiento claro de métricas y señales del negocio', 'Estado del proyecto, soporte y notificaciones en un solo espacio', 'Acceso administrado por invitación', 'Contexto real de cada cuenta sin lenguaje técnico innecesario', 'Experiencia privada optimizada para escritorio y mobile'],
    results: [{ label: 'Vista unificada', value: 'Métricas + proyecto' }, { label: 'Acceso', value: 'Privado por invitación' }, { label: 'Soporte', value: 'Contexto útil' }],
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
      'La solución mejora la velocidad de respuesta, ordena la información crítica y fortalece la colaboración entre usuarios.',
    features: ['Reportes de objetos robados geolocalizados', 'Búsqueda por categoría, zona y descripción', 'Alertas y notificaciones en tiempo real', 'Canal comunitario para seguimiento de casos', 'Panel administrable para moderación y soporte'],
    results: [{ label: 'Foco', value: 'Seguridad 24/7' }, { label: 'Cobertura', value: 'Comunidad activa' }, { label: 'Objetivo', value: 'Recuperación rápida' }],
    image: '/safespot.webp',
    detailsUrl: '/showroom',
    externalUrl: 'https://safespot.tuweb-ai.com/',
  },
  {
    id: 4,
    title: 'Trading TuWeb.ai',
    category: 'saas',
    description: 'Dashboard de trading para monitoreo de mercado, gestión de operaciones y seguimiento en tiempo real.',
    clientNeed:
      'Tomar decisiones con datos visibles y seguimiento continuo, sin dashboards confusos ni información fragmentada.',
    solutionSummary:
      'Desarrollamos un panel de trading con monitoreo de mercado, operaciones y rendimiento en una sola interfaz.',
    valueSummary:
      'El sistema mejora claridad operativa, velocidad de lectura y control diario sobre balances, riesgo y movimientos.',
    features: ['Panel de mercado con métricas en vivo', 'Seguimiento de operaciones y posiciones', 'Resumen de rendimiento y riesgo', 'Vista clara de balances y movimientos', 'Experiencia optimizada para toma de decisiones'],
    results: [{ label: 'Visibilidad', value: 'Tiempo real' }, { label: 'Control', value: 'Operaciones 24/7' }, { label: 'Análisis', value: 'Rendimiento continuo' }],
    image: '/trading-tuwebai.webp',
    detailsUrl: '/showroom',
    externalUrl: 'https://trading.tuweb-ai.com/',
  },
  {
    id: 5,
    title: 'Captiva',
    category: 'landing-pages',
    description: 'Sistema de generación de demos y landing pages orientadas a conversión para negocios locales.',
    clientNeed:
      'Validar una oferta digital con una página enfocada en captar leads calificados sin distracciones ni navegación innecesaria.',
    solutionSummary:
      'Desarrollamos una landing page de conversión con propuesta de valor directa, estructura comercial y CTA visibles desde el primer scroll.',
    valueSummary:
      'La solución ayuda a comunicar mejor la oferta, reducir fricción en la decisión y transformar visitas en consultas concretas.',
    features: ['Hero con propuesta de valor clara', 'CTA visibles en los puntos críticos', 'Secciones pensadas para objeciones y confianza', 'Diseño mobile-first enfocado en conversión', 'Landing lista para campañas y tráfico pago'],
    results: [{ label: 'Formato', value: 'Landing' }, { label: 'Objetivo', value: 'Mís leads' }, { label: 'Enfoque', value: 'Conversión' }],
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
      'Probar una hipótesis de producto con una experiencia rápida de lanzar, fácil de entender y lista para medir respuesta real.',
    solutionSummary:
      'Construimos una landing experimental con narrativa breve, foco visual y estructura mínima para testear interés sin sobrecargar la experiencia.',
    valueSummary:
      'El proyecto permite iterar rápido, validar mensaje y detectar si la idea genera atención antes de invertir en una plataforma mayor.',
    features: ['Enfoque experimental de validación rápida', 'Narrativa breve y visual', 'Estructura simple para medir interés', 'Experiencia optimizada para mobile', 'Base liviana para iterar nuevas versiones'],
    results: [{ label: 'Tipo', value: 'Experimental' }, { label: 'Objetivo', value: 'Validación' }, { label: 'Velocidad', value: 'Iteración rápida' }],
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
