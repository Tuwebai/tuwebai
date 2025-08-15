import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import AnimatedShape from '../ui/animated-shape';
import TestimonialForm from '../ui/testimonial-form';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getAllTestimonials, createTestimonial, Testimonial as TestimonialType } from '@/services/testimonials';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  name: string;
  company: string;
  testimonial: string;
  isNew?: boolean;
}

interface TestimonialCardProps {
  name: string;
  company: string;
  testimonial: string;
  delay: number;
  isNew?: boolean;
  avatar?: string;
}

function TestimonialCard({ name, company, testimonial, delay, isNew, avatar }: TestimonialCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver();

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        delay: delay * 0.2 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`bg-glass rounded-xl p-6 relative border border-gray-800 shadow-lg mx-2 ${isNew ? 'ring-2 ring-[#00CCFF]' : ''}`}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 204, 255, 0.2), 0 10px 10px -5px rgba(153, 51, 255, 0.2)' }}
      transition={{ duration: 0.3 }}
    >
      {isNew && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white text-xs px-2 py-1 rounded-full">
          Nuevo
        </div>
      )}
      
      <div className="absolute -top-4 left-6 h-10 w-10 flex items-center justify-center text-3xl">
        <div className="p-2 rounded-full bg-gradient-to-br from-[#00CCFF] to-[#9933FF] shadow-lg shadow-[#00CCFF]/10">
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
        <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial}"</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] p-[2px] mr-3">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white font-medium">
                {name.charAt(0)}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white">{name}</h4>
              <p className="text-sm text-gray-400">{company}</p>
            </div>
          </div>
          
          <div className="h-1 w-12 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
}

interface TestimonialsSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function TestimonialsSection({ setRef }: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver();
  const sliderRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Estado para gestionar los testimonios
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar testimonios desde Firestore al montar el componente
  useEffect(() => {
    loadTestimonials();
  }, []);
  
  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const allTestimonials = await getAllTestimonials();
      
      // Convertir testimonios de Firestore al formato local
      const formattedTestimonials: Testimonial[] = allTestimonials.map(t => ({
        name: t.name,
        company: t.company,
        testimonial: t.testimonial,
        isNew: false
      }));
      
      setTestimonials(formattedTestimonials);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los testimonios. Por favor, recarga la página.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Set the ref for the parent component
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };
  
  // Función para agregar un nuevo testimonio
  const handleAddTestimonial = useCallback(async (newTestimonial: Testimonial) => {
    try {
      // Guardar testimonio en Firestore
      await createTestimonial({
        name: newTestimonial.name,
        company: newTestimonial.company,
        testimonial: newTestimonial.testimonial
      });
      
      // Marcar el testimonio como nuevo para mostrar en la UI
      const testimonialWithFlag = {
        ...newTestimonial,
        isNew: true
      };
      
      // Actualizar la lista de testimonios localmente
      setTestimonials(prevTestimonials => [testimonialWithFlag, ...prevTestimonials]);
      
      // Mostrar mensaje de éxito
      toast({
        title: "¡Testimonio publicado!",
        description: "Tu testimonio ha sido publicado exitosamente en nuestra sección de testimonios.",
      });
      
      // Si hay un slider activo, moverse a la primera diapositiva para mostrar el nuevo testimonio
      if (sliderRef.current) {
        setTimeout(() => {
          // @ts-ignore
          sliderRef.current.slickGoTo(0);
        }, 300);
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el testimonio. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  }, [sliderRef, toast]);

  // Configuración del slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ],
    appendDots: (dots: React.ReactNode) => (
      <div style={{ position: 'relative', bottom: '-20px' }}>
        <ul className="flex justify-center gap-2 mt-6">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-gray-700 hover:bg-[#00CCFF] transition-colors mx-1" />
    )
  };

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-1"
    >
      <AnimatedShape type={1} className="top-[20%] right-[-150px]" delay={2} />
      <AnimatedShape type={2} className="bottom-[10%] left-[-100px]" delay={3} />
      
      <div className="container mx-auto px-4 py-16 z-10">
        <motion.div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-16"
          initial="hidden"
          animate={titleVisible ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-6">
            <span className="gradient-text gradient-border inline-block pb-2">Testimonios de Nuestros Clientes</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Lo Que Dicen Quienes Ya Han Confiado en Nosotros
          </p>
        </motion.div>
        
        {/* Versión móvil y tablet: Slider */}
        <div className="lg:hidden w-full px-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CCFF]"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Aún no hay testimonios publicados.</p>
              <p className="text-gray-500 text-sm mt-2">¡Sé el primero en compartir tu experiencia!</p>
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
          
          {/* Controles del slider */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              // @ts-ignore
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00CCFF] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              // @ts-ignore
              onClick={() => sliderRef.current?.slickNext()}
              className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#9933FF] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Versión desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="col-span-3 flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CCFF]"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-400 text-lg">Aún no hay testimonios publicados.</p>
              <p className="text-gray-500 text-sm mt-2">¡Sé el primero en compartir tu experiencia!</p>
            </div>
          ) : (
            <AnimatePresence>
              {testimonials.slice(0, 6).map((testimonial, index) => (
                <motion.div 
                  key={`desktop-${testimonial.name}-${index}`}
                  initial={testimonial.isNew ? { opacity: 0, scale: 0.8 } : false}
                  animate={testimonial.isNew ? { opacity: 1, scale: 1 } : false}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  <TestimonialCard 
                    name={testimonial.name}
                    company={testimonial.company}
                    testimonial={testimonial.testimonial}
                    delay={index % 3}
                    isNew={testimonial.isNew}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        
        {/* Botón de "Dejar testimonio" */}
        <div className="flex justify-center">
          <TestimonialForm onAddTestimonial={handleAddTestimonial} />
        </div>
      </div>
    </section>
  );
}