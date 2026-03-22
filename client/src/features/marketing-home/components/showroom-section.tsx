import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import type { ShowroomProject } from '@/features/marketing-home/components/showroom-types';

const ShowroomProjectModal = lazy(
  () => import('@/features/marketing-home/components/showroom-project-modal'),
);

interface ShowroomSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ShowroomSection({ setRef }: ShowroomSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } =
    useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } =
    useIntersectionObserver<HTMLDivElement>();
  const { ref: projectsRef, hasIntersected: projectsVisible } =
    useIntersectionObserver<HTMLDivElement>();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ShowroomProject | null>(null);
  const [hasShownTitle, setHasShownTitle] = useState(false);
  const [hasShownSubtitle, setHasShownSubtitle] = useState(false);
  const [hasShownProjects, setHasShownProjects] = useState(false);

  useEffect(() => {
    if (titleVisible) setHasShownTitle(true);
  }, [titleVisible]);

  useEffect(() => {
    if (subtitleVisible) setHasShownSubtitle(true);
  }, [subtitleVisible]);

  useEffect(() => {
    if (projectsVisible) setHasShownProjects(true);
  }, [projectsVisible]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedProject]);

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const projects: ShowroomProject[] = [
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
      features: [
        'Decants 100% originales',
        'Fragancias exclusivas del mundo',
        'Preserva calidad e intensidad',
        'Frascos auténticos',
        'Elegancia en su forma más pura',
      ],
      results: [
        { label: 'Satisfacción', value: '98%' },
        { label: 'Productos originales', value: '100%' },
        { label: 'Fragancias', value: '+200' },
      ],
      image: '/lhdecant-card.webp',
      detailsUrl: '/showroom',
      externalUrl: 'https://lhdecant.com/',
    },
    {
      id: 2,
      title: 'TuWeb.ai Dashboard',
      category: 'saas',
      description:
        'Panel interno para gestión de proyectos, soporte, pagos y visibilidad del ecosistema TuWebAI.',
      sectionLabels: {
        clientNeed: 'Qué necesitábamos resolver',
        solutionSummary: 'Qué desarrollamos en TuWeb.ai',
        valueSummary: 'Qué mejora en la operación',
      },
      clientNeed:
        'Ordenar la operación diaria de TuWeb.ai con una plataforma propia que unifique seguimiento, soporte y estado de servicio sin depender de procesos dispersos.',
      solutionSummary:
        'Desarrollamos un dashboard interno para centralizar proyectos, tickets, pagos y trazabilidad operativa dentro del ecosistema TuWeb.ai.',
      valueSummary:
        'La plataforma reduce fricción interna, mejora la visibilidad del servicio y profesionaliza la gestión operativa de punta a punta.',
      features: [
        'Acceso seguro por usuario',
        'Seguimiento operativo en tiempo real',
        'Centro unificado de tickets y respuestas',
        'Historial de pagos y estado de servicio',
        'Panel optimizado para desktop y mobile',
      ],
      results: [
        { label: 'Visibilidad operativa', value: '360°' },
        { label: 'Módulos', value: '4' },
        { label: 'Disponibilidad', value: '24/7' },
      ],
      image: '/dashboardtuwebai.webp',
      detailsUrl: '/showroom',
      externalUrl: 'https://dashboard.tuweb-ai.com/',
    },
    {
      id: 3,
      title: 'SafeSpot',
      category: 'seguridad-ciudadana',
      description:
        'Plataforma de reporte colaborativo de objetos robados con alertas y mapa en tiempo real.',
      clientNeed:
        'Dar a la comunidad una herramienta concreta para reportar, alertar y seguir casos de seguridad sin depender de canales fragmentados.',
      solutionSummary:
        'Creamos una plataforma web para reportes geolocalizados, alertas y seguimiento comunitario en tiempo real.',
      valueSummary:
        'La solución mejora la velocidad de respuesta, ordena la información crítica y fortalece la colaboración entre usuarios.',
      features: [
        'Reportes de objetos robados geolocalizados',
        'Búsqueda por categoría, zona y descripción',
        'Alertas y notificaciones en tiempo real',
        'Canal comunitario para seguimiento de casos',
        'Panel administrable para moderación y soporte',
      ],
      results: [
        { label: 'Foco', value: 'Seguridad 24/7' },
        { label: 'Cobertura', value: 'Comunidad activa' },
        { label: 'Objetivo', value: 'Recuperación rápida' },
      ],
      image: '/safespot.webp',
      detailsUrl: '/showroom',
      externalUrl: 'https://safespot.tuweb-ai.com/',
    },
    {
      id: 4,
      title: 'Trading TuWeb.ai',
      category: 'saas',
      description:
        'Dashboard de trading para monitoreo de mercado, gestión de operaciones y seguimiento en tiempo real.',
      clientNeed:
        'Tomar decisiones con datos visibles y seguimiento continuo, sin dashboards confusos ni información fragmentada.',
      solutionSummary:
        'Desarrollamos un panel de trading con monitoreo de mercado, operaciones y rendimiento en una sola interfaz.',
      valueSummary:
        'El sistema mejora claridad operativa, velocidad de lectura y control diario sobre balances, riesgo y movimientos.',
      features: [
        'Panel de mercado con métricas en vivo',
        'Seguimiento de operaciones y posiciones',
        'Resumen de rendimiento y riesgo',
        'Vista clara de balances y movimientos',
        'Experiencia optimizada para toma de decisiones',
      ],
      results: [
        { label: 'Visibilidad', value: 'Tiempo real' },
        { label: 'Control', value: 'Operaciones 24/7' },
        { label: 'Análisis', value: 'Rendimiento continuo' },
      ],
      image: '/trading-tuwebai.webp',
      detailsUrl: '/showroom',
      externalUrl: 'https://trading.tuweb-ai.com/',
    },
    {
      id: 5,
      title: 'Captiva',
      category: 'landing-pages',
      description:
        'Sistema de generación de demos y landing pages orientadas a conversión para negocios locales.',
      clientNeed:
        'Validar una oferta digital con una página enfocada en captar leads calificados sin distracciones ni navegación innecesaria.',
      solutionSummary:
        'Desarrollamos una landing page de conversión con propuesta de valor directa, estructura comercial y CTA visibles desde el primer scroll.',
      valueSummary:
        'La solución ayuda a comunicar mejor la oferta, reducir fricción en la decisión y transformar visitas en consultas concretas.',
      features: [
        'Hero con propuesta de valor clara',
        'CTA visibles en los puntos críticos',
        'Secciones pensadas para objeciones y confianza',
        'Diseño mobile-first enfocado en conversión',
        'Landing lista para campañas y tráfico pago',
      ],
      results: [
        { label: 'Formato', value: 'Landing' },
        { label: 'Objetivo', value: 'Más leads' },
        { label: 'Enfoque', value: 'Conversión' },
      ],
      image: '/captiva.png',
      detailsUrl: '/showroom',
      externalUrl: 'https://captiva.tuweb-ai.com/captiva',
    },
    {
      id: 6,
      title: 'Instadetox',
      category: 'experimental',
      description:
        'Experimento para validar una idea digital: propuesta simple, visual y directa al usuario.',
      clientNeed:
        'Probar una hipótesis de producto con una experiencia rápida de lanzar, fácil de entender y lista para medir respuesta real.',
      solutionSummary:
        'Construimos una landing experimental con narrativa breve, foco visual y estructura mínima para testear interés sin sobrecargar la experiencia.',
      valueSummary:
        'El proyecto permite iterar rápido, validar mensaje y detectar si la idea genera atención antes de invertir en una plataforma mayor.',
      features: [
        'Enfoque experimental de validación rápida',
        'Narrativa breve y visual',
        'Estructura simple para medir interés',
        'Experiencia optimizada para mobile',
        'Base liviana para iterar nuevas versiones',
      ],
      results: [
        { label: 'Tipo', value: 'Experimental' },
        { label: 'Objetivo', value: 'Validación' },
        { label: 'Velocidad', value: 'Iteración rápida' },
      ],
      image: '/instadetox.png',
      detailsUrl: '/showroom',
      externalUrl: 'https://instadetox.netlify.app/',
    },
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  const selectedProjectIndex = selectedProject
    ? filteredProjects.findIndex((project) => project.id === selectedProject.id)
    : -1;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedProject) {
        return;
      }

      if (event.key === 'Escape') {
        setSelectedProject(null);
        return;
      }

      if (event.key === 'ArrowLeft' && selectedProjectIndex > 0) {
        setSelectedProject(filteredProjects[selectedProjectIndex - 1]);
        return;
      }

      if (
        event.key === 'ArrowRight' &&
        selectedProjectIndex >= 0 &&
        selectedProjectIndex < filteredProjects.length - 1
      ) {
        setSelectedProject(filteredProjects[selectedProjectIndex + 1]);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredProjects, selectedProject, selectedProjectIndex]);

  const categories = ['all', ...Array.from(new Set(projects.map((project) => project.category)))];

  const categoryNames: Record<string, string> = {
    all: 'Todos',
    'e-commerce': 'E-commerce',
    'landing-pages': 'Landing Pages',
    saas: 'SaaS',
    experimental: 'Experimental',
    'seguridad-ciudadana': 'Seguridad',
    muebleria: 'Mueblerías',
    'tienda-online': 'Tiendas Online',
    'salud-bienestar': 'Salud y Bienestar',
    'diseno-branding': 'Diseño y Branding',
    'turismo-exclusivo': 'Turismo Exclusivo',
    educacion: 'Educación',
    mascotas: 'Mascotas',
  };

  const handleProjectClick = (project: ShowroomProject) => {
    setSelectedProject(project);
  };

  const handlePrevProject = () => {
    if (selectedProjectIndex > 0) {
      setSelectedProject(filteredProjects[selectedProjectIndex - 1]);
    }
  };

  const handleNextProject = () => {
    if (selectedProjectIndex >= 0 && selectedProjectIndex < filteredProjects.length - 1) {
      setSelectedProject(filteredProjects[selectedProjectIndex + 1]);
    }
  };

  const handleVisitWebsite = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="showroom"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-1 py-20"
    >
      <div className="container z-10 mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center transition-all duration-700 ${
            hasShownTitle ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="mb-4 font-rajdhani text-3xl font-bold md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Lo que construimos
            </span>
          </h2>
        </div>

        <div
          ref={subtitleRef}
          className={`mb-12 text-center transition-all duration-700 ${
            hasShownSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Proyectos propios y de clientes desarrollados a medida. Sin templates. Con código
            real.
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                    : 'bg-[#121217] text-gray-400 transition-colors hover:bg-[#1a1a23] hover:text-white'
                }`}
              >
                {categoryNames[category] || category}
              </button>
            ))}
          </div>
        </div>

        <div ref={projectsRef} className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`h-full cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-[#121217] transition-all duration-500 ${
                hasShownProjects
                  ? 'translate-y-0 opacity-100 hover:-translate-y-1'
                  : 'translate-y-5 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
              onClick={() => handleProjectClick(project)}
            >
              <div className="group relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-sm font-medium text-white">Vista previa</span>
                </div>
                {project.externalUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={(event) => handleVisitWebsite(project.externalUrl!, event)}
                      className="transform rounded-lg bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-4 py-2 font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#00CCFF]/20"
                    >
                      Visitar página web
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-rajdhani text-xl font-bold text-white">{project.title}</h3>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-[#1a1a23] px-2 py-1 text-xs text-gray-400">
                    {categoryNames[project.category] || project.category}
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      project.id === 1
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-white/8 text-gray-300'
                    }`}
                  >
                    {project.id === 1 ? 'Cliente' : 'Proyecto propio'}
                  </span>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-gray-400">{project.description}</p>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleProjectClick(project);
                  }}
                  className="flex items-center text-sm font-medium text-[#00CCFF] transition-colors hover:text-[#9933FF]"
                >
                  <span>Ver detalles</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedProject && (
          <Suspense fallback={null}>
            <ShowroomProjectModal
              project={selectedProject}
              categoryLabel={categoryNames[selectedProject.category] || selectedProject.category}
              currentIndex={selectedProjectIndex}
              totalProjects={filteredProjects.length}
              hasPrev={selectedProjectIndex > 0}
              hasNext={
                selectedProjectIndex >= 0 && selectedProjectIndex < filteredProjects.length - 1
              }
              prevLabel={
                selectedProjectIndex > 0
                  ? filteredProjects[selectedProjectIndex - 1].title
                  : undefined
              }
              nextLabel={
                selectedProjectIndex >= 0 &&
                selectedProjectIndex < filteredProjects.length - 1
                  ? filteredProjects[selectedProjectIndex + 1].title
                  : undefined
              }
              onPrev={handlePrevProject}
              onNext={handleNextProject}
              onClose={() => setSelectedProject(null)}
            />
          </Suspense>
        )}

        <div className="mt-14 text-center">
          <p className="font-rajdhani text-2xl font-bold text-white sm:text-3xl">
            ¿Tenés un proyecto en mente?
          </p>
          <p className="mx-auto mb-6 mt-4 max-w-2xl text-gray-300">
            Contanos qué necesita tu negocio y te decimos si podemos construirlo, y cómo.
          </p>

          <div className="transition-transform duration-200 hover:scale-[1.05]">
            <Link
              to="/consulta"
              className="inline-block rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-8 py-4 font-medium text-white shadow-lg hover:shadow-[#00CCFF]/20"
            >
              Quiero una solución similar →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
