import { useCallback, useRef } from 'react';

import Slider from 'react-slick';

import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import { useTestimonials } from '@/features/testimonials/hooks/use-testimonials';
import AnimatedShape from '@/shared/ui/animated-shape';
import RevealBlock from '@/shared/ui/reveal-block';

import TestimonialForm from '@/features/testimonials/components/testimonial-form';

import '@/features/testimonials/components/testimonials-section.css';

interface TestimonialCardProps {
  name: string;
  company: string;
  testimonial: string;
  delay: number;
  isNew?: boolean;
}

function TestimonialCard({ name, company, testimonial, delay, isNew }: TestimonialCardProps) {
  const { ref } = useIntersectionObserver({ rootMargin: '0px 0px -10% 0px' });

  return (
    <RevealBlock
      className={`mx-2 rounded-xl border border-gray-800 bg-glass p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(0,204,255,0.2),0_10px_10px_-5px_rgba(153,51,255,0.2)] ${
        isNew ? 'ring-2 ring-[#00CCFF]' : ''
      }`}
      delayMs={delay * 120}
      durationMs={600}
    >
      <div ref={ref as React.RefObject<HTMLDivElement>} className="relative">
        {isNew ? (
          <div className="absolute -right-3 -top-3 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-2 py-1 text-xs text-white">
            Nuevo
          </div>
        ) : null}

        <div className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center text-3xl">
          <div className="rounded-full bg-gradient-to-br from-[#00CCFF] to-[#9933FF] p-2 shadow-lg shadow-[#00CCFF]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
            </svg>
          </div>
        </div>

        <div className="pt-6">
          <p className="mb-6 italic leading-relaxed text-gray-300">"{testimonial}"</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 w-10 h-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-800 font-medium text-white">
                  {name.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white">{name}</h4>
                <p className="text-sm text-gray-400">{company}</p>
              </div>
            </div>

            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF]"></div>
          </div>
        </div>
      </div>
    </RevealBlock>
  );
}

interface TestimonialsSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function TestimonialsSection({ setRef }: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: queryGateRef, hasIntersected: testimonialsVisible } = useIntersectionObserver({
    rootMargin: '250px 0px',
  });
  const sliderRef = useRef<Slider | null>(null);
  const { data: testimonials = [], isLoading: loading } = useTestimonials({ enabled: testimonialsVisible });
  const hasMultipleTestimonials = testimonials.length > 1;

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const handleTestimonialSuccess = useCallback(() => {
    if (sliderRef.current) {
      setTimeout(() => {
        sliderRef.current?.slickGoTo(0);
      }, 300);
    }
  }, []);

  const settings = {
    dots: hasMultipleTestimonials,
    infinite: hasMultipleTestimonials,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: hasMultipleTestimonials,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    appendDots: (dots: React.ReactNode) => (
      <div style={{ position: 'relative', bottom: '-20px' }}>
        <ul className="mt-6 flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="mx-1 h-3 w-3 rounded-full bg-gray-700 transition-colors hover:bg-[#00CCFF]" />
    ),
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-1"
    >
      <AnimatedShape type={1} className="top-[20%] right-[-150px]" delay={2} />
      <AnimatedShape type={2} className="bottom-[10%] left-[-100px]" delay={3} />

      <div ref={queryGateRef as React.RefObject<HTMLDivElement>} className="container mx-auto z-10 px-4 py-16">
        <RevealBlock className="mb-16 text-center" durationMs={800}>
          <h2 className="mb-6 font-rajdhani text-3xl font-bold md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">Lo que valoran quienes trabajan con TuWeb.ai</span>
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Experiencias reales de clientes que necesitaban una presencia digital mas clara, mas profesional y mejor preparada para crecer.
          </p>
        </RevealBlock>

        <div className="w-full px-2 lg:hidden">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#00CCFF]"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-400">Todavia no hay testimonios publicados.</p>
              <p className="mt-2 text-sm text-gray-500">Cuando empecemos a recibir mas historias reales, las vas a ver aca.</p>
            </div>
          ) : !hasMultipleTestimonials ? (
            <div className="px-2">
              <TestimonialCard
                name={testimonials[0].name}
                company={testimonials[0].company}
                testimonial={testimonials[0].testimonial}
                delay={0}
                isNew={testimonials[0].isNew}
              />
            </div>
          ) : (
            <Slider {...settings} ref={sliderRef}>
              {testimonials.map((testimonial, index: number) => (
                <div key={`mobile-${testimonial.name}-${index}`} className="px-2">
                  <TestimonialCard
                    name={testimonial.name}
                    company={testimonial.company}
                    testimonial={testimonial.testimonial}
                    delay={index % 3}
                    isNew={testimonial.isNew}
                  />
                </div>
              ))}
            </Slider>
          )}

          {hasMultipleTestimonials ? (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-200 hover:scale-105 hover:border-[#00CCFF] hover:text-white active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-200 hover:scale-105 hover:border-[#9933FF] hover:text-white active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          ) : null}
        </div>

        <div className="mx-auto hidden max-w-6xl gap-8 lg:grid lg:grid-cols-3">
          {loading ? (
            <div className="col-span-3 flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#00CCFF]"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="col-span-3 py-12 text-center">
              <p className="text-lg text-gray-400">Todavia no hay testimonios publicados.</p>
              <p className="mt-2 text-sm text-gray-500">Cuando empecemos a recibir mas historias reales, las vas a ver aca.</p>
            </div>
          ) : (
            testimonials.slice(0, 6).map((testimonial, index) => (
              <div
                key={`desktop-${testimonial.name}-${index}`}
                className={testimonial.isNew ? 'transition-all duration-300 ease-out opacity-100 scale-100' : ''}
              >
                <TestimonialCard
                  name={testimonial.name}
                  company={testimonial.company}
                  testimonial={testimonial.testimonial}
                  delay={index % 3}
                  isNew={testimonial.isNew}
                />
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center">
          <TestimonialForm onSuccess={handleTestimonialSuccess} />
        </div>
      </div>
    </section>
  );
}
