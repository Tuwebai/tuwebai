import { useRef } from 'react';

import AnimatedShape from '@/shared/ui/animated-shape';
import RevealBlock from '@/shared/ui/reveal-block';

interface PhilosophySectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function PhilosophySection({ setRef }: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-2"
    >
      <AnimatedShape type={1} className="top-[30%] left-[-150px]" delay={5} />

      <div className="container z-10 mx-auto grid items-center gap-10 px-3 py-14 sm:px-4 sm:py-16 md:grid-cols-2 md:gap-12">
        <RevealBlock
          hiddenClassName="opacity-0 -translate-x-8"
          visibleClassName="opacity-100 translate-x-0"
        >
          <h2 className="mb-6 font-rajdhani text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Un enfoque web pensado para negocio, no para improvisar
            </span>
          </h2>

          <p className="mb-6 text-base font-medium leading-7 text-gray-200 sm:text-lg md:text-xl">
            Disenamos, desarrollamos y optimizamos experiencias web que ayudan a vender mejor,
            operar con mas claridad y transmitir una imagen profesional.
          </p>

          <p className="mb-4 text-gray-300">
            No trabajamos con recetas genericas ni con sitios que se ven bien pero no acompanan
            al negocio. Cada proyecto se construye con foco en objetivos reales, estructura clara
            y rendimiento.
          </p>

          <p className="mb-4 text-gray-300">
            El objetivo no es solo publicar una web: es crear una plataforma digital seria,
            confiable y preparada para crecer con tu empresa.
          </p>

          <div className="mb-2 inline-flex items-center space-x-3">
            <div className="h-1 w-12 bg-[#00CCFF]" />
            <span className="font-rajdhani text-sm uppercase tracking-wider text-gray-400">
              Como trabajamos
            </span>
          </div>

          <ul className="mb-4 space-y-3">
            <li className="text-gray-300">• Estrategia antes que decoracion</li>
            <li className="text-gray-300">• Desarrollo web alineado al negocio</li>
            <li className="text-gray-300">• Rendimiento, claridad y confianza</li>
            <li className="text-gray-300">• Base preparada para escalar</li>
          </ul>
        </RevealBlock>

        <RevealBlock
          hiddenClassName="opacity-0 translate-x-8"
          visibleClassName="opacity-100 translate-x-0"
          delayMs={160}
        >
          <div className="relative rounded-lg bg-gradient-to-br from-[#00CCFF] to-[#9933FF] p-1">
            <div className="rounded-lg bg-[#0a0a0f] p-5 sm:p-8">
              <h3 className="mb-4 font-rajdhani text-xl text-gray-100 sm:text-2xl">
                Lo que resolvemos en proyectos reales
              </h3>
              <p className="mb-5 font-medium text-gray-200">
                Muchas empresas ya tienen presencia online, pero no una web que realmente
                acompane ventas, operacion y crecimiento.
              </p>
              <ul className="mb-4 space-y-3">
                <li className="text-gray-300">• Sitios que no transmiten confianza ni profesionalismo</li>
                <li className="text-gray-300">• Estructuras confusas que dificultan conversion y contacto</li>
                <li className="text-gray-300">• Herramientas desconectadas del proceso comercial</li>
                <li className="text-gray-300">• Tecnologia que se vuelve una carga en vez de una ventaja</li>
              </ul>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm leading-relaxed text-gray-300">
                  Por eso trabajamos con una logica simple: entender el negocio, definir
                  prioridades y construir una solucion web clara, rapida y lista para sostener
                  crecimiento real.
                </p>
              </div>
            </div>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
