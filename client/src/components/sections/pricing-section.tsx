import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { backendApi, type PaymentPlan } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';
import { useToast } from '@/hooks/use-toast';

interface PricingTierProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  delay: number;
  onSelect?: () => void;
  isSubmitting?: boolean;
}

function PricingTier({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  highlight = false, 
  popular = false,
  delay,
  onSelect,
  isSubmitting = false,
}: PricingTierProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>();

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        delay: delay * 0.2 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref}
      className={`relative h-full ${highlight ? 'lg:-mt-5 lg:-mb-5' : ''}`}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={cardVariants}
    >
      {popular && (
        <div className="absolute -top-4 inset-x-0 flex justify-center">
          <span className="px-4 py-1 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white text-xs font-medium">
            Más popular
          </span>
        </div>
      )}
      
      <div className={`relative h-full flex flex-col rounded-xl overflow-hidden ${
        highlight 
          ? 'bg-gradient-to-r from-[#00CCFF]/50 to-[#9933FF]/50 p-[2px]' 
          : 'border border-gray-800'
      }`}>
        <div className={`flex-grow flex flex-col ${
          highlight 
            ? 'bg-[#121217] rounded-xl' 
            : ''
        }`}>
          <div className={`p-6 text-center border-b ${
            highlight 
              ? 'border-[#00CCFF]/20' 
              : 'border-gray-800'
          }`}>
            <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">{title}</h3>
            <div className="mb-3">
              <span className="text-3xl font-bold text-white">{price}</span>
              {period && <span className="text-gray-400">/{period}</span>}
            </div>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          
          <div className="p-6 flex-grow flex flex-col">
            <ul className="space-y-4 mb-6 flex-grow">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                    highlight 
                      ? 'text-[#00CCFF]' 
                      : 'text-gray-400'
                  } mr-2 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <motion.button
              type="button"
              onClick={() => onSelect && onSelect()}
              disabled={isSubmitting}
              className={`block text-center py-3 px-4 rounded-lg ${
                highlight 
                  ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white' 
                  : 'bg-[#1a1a23] text-white border border-gray-700 hover:bg-[#252530]'
              } transition-colors font-medium w-full disabled:opacity-60 disabled:cursor-not-allowed`}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              aria-label={highlight ? 'Empezar ahora' : 'Solicitar plan'}
            >
              {isSubmitting ? 'Redirigiendo...' : highlight ? 'Empezar ahora' : 'Solicitar plan'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface PricingSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function PricingSection({ setRef }: PricingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [submittingPlan, setSubmittingPlan] = useState<PaymentPlan | null>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { toast } = useToast();

  useEffect(() => {
    if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
      setRef(sectionRef.current);
      sectionRef.current.setAttribute('data-ref-set', 'true');
    }
  }, [setRef]);

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
  };

  const handleCheckout = async (plan: PaymentPlan) => {
    try {
      setSubmittingPlan(plan);
      const data = await backendApi.createPaymentPreference(plan);
      if (typeof data?.init_point === 'string' && data.init_point.length > 0) {
        window.location.href = data.init_point;
      } else {
        throw new Error('Mercado Pago no devolvio un link de checkout');
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error al conectar con Mercado Pago',
        description: getUiErrorMessage(err, 'Error al conectar con Mercado Pago'),
      });
    } finally {
      setSubmittingPlan(null);
    }
  };

  return (
    <section 
      id="pricing" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-1 py-20"
    >
      
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          ref={titleRef}
          className="text-center"
          initial="hidden"
          animate={titleVisible ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-4">
            <span className="gradient-text gradient-border inline-block pb-2">Planes a tu Medida</span>
          </h2>
        </motion.div>
        
        <motion.div 
          ref={subtitleRef}
          className="text-center mb-16"
          initial="hidden"
          animate={subtitleVisible ? "visible" : "hidden"}
          variants={subtitleVariants}
        >
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Soluciones flexibles que se adaptan a tus necesidades y crecen con tu negocio. Sin sorpresas ni costos ocultos.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <PricingTier 
            title="Plan Básico"
            price="$299.000"
            period="mes"
            description="Ideal para empresas pequeñas que inician su presencia digital"
            features={[
              "Sitio web de 5 páginas",
              "Optimización SEO básica",
              "Diseño responsive",
              "Formulario de contacto",
              "Integración con redes sociales",
              "Soporte técnico por 3 meses"
            ]}
            delay={1}
            onSelect={() => handleCheckout('esencial')}
            isSubmitting={submittingPlan === 'esencial'}
          />
          
          <PricingTier 
            title="Plan Profesional"
            price="$499.000"
            period="mes"
            description="Perfecto para empresas en crecimiento que buscan destacar"
            features={[
              "Sitio web de 10 páginas",
              "Estrategia SEO completa",
              "Sistema de gestión de contenido",
              "Panel de administración",
              "Email marketing (hasta 1,000 suscriptores)",
              "Integraciones con CRM",
              "Soporte técnico prioritario"
            ]}
            highlight={true}
            popular={true}
            delay={2}
            onSelect={() => handleCheckout('avanzado')}
            isSubmitting={submittingPlan === 'avanzado'}
          />
          
          <PricingTier 
            title="Plan Enterprise"
            price="Personalizado"
            period=""
            description="Para empresas con necesidades específicas y a gran escala"
            features={[
              "Sitio web con páginas ilimitadas",
              "Estrategia digital completa",
              "SEO avanzado y SEM",
              "Automatización de marketing",
              "Desarrollos a medida",
              "Integraciones avanzadas",
              "Soporte técnico 24/7",
              "Gerente de cuenta dedicado"
            ]}
            delay={3}
            onSelect={() => handleCheckout('premium')}
            isSubmitting={submittingPlan === 'premium'}
          />
        </div>
        
        <div className="mt-14 text-center">
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            ¿Necesitas una solución más específica? Ofrecemos planes personalizados diseñados para cubrir exactamente lo que tu negocio necesita.
          </p>
          
          <motion.a 
            href="/consulta" 
            className="inline-block px-6 py-3 border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Consultar planes personalizados
          </motion.a>
        </div>
      </div>
    </section>
  );
}
