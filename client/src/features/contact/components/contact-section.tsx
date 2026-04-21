import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useTrackSectionView } from '@/core/hooks/use-track-section-view';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import {
  getContactErrorMessage,
  getContactFieldErrors,
  submitContactForm,
} from '@/features/contact/services/contact.service';
import {
  trackContactEmailClick,
  trackContactFormClick,
  trackContactFormSubmit,
  trackContactPhoneClick,
} from '@/features/contact/services/contact-analytics.service';
import {
  TUWEBAI_BUSINESS_HOURS,
  TUWEBAI_EMAIL,
  TUWEBAI_WHATSAPP_DISPLAY,
  TUWEBAI_WHATSAPP_TEL,
} from '@/shared/constants/contact';
import AnimatedShape from '@/shared/ui/animated-shape';
import { useToast } from '@/shared/ui/use-toast';

interface ContactFormProps {
  delay: number;
}

function ContactForm({ delay }: ContactFormProps) {
  const { ref, hasIntersected } = useIntersectionObserver();
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formState.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formState.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formState.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formState.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formState.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const snapshot = { ...formState };
    setSubmitState('submitting');
    setErrors({});

    void submitContactForm({
      name: snapshot.name,
      email: snapshot.email,
      message: snapshot.message,
      source: 'sitio_web_principal',
    })
      .then(() => {
        setSubmitState('sent');
        setFormState({ name: '', email: '', message: '' });
        trackContactFormSubmit();
        toast({
          title: 'Solicitud recibida',
          description: 'Te vamos a contactar a la brevedad para revisar tu consulta.',
        });

        setTimeout(() => {
          setSubmitState('idle');
        }, 4000);
      })
      .catch((error: unknown) => {
        const serverErrors = getContactFieldErrors(error);
        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors);
        }
        setSubmitState('idle');
        toast({
          title: 'Error al enviar',
          description: getContactErrorMessage(
            error,
            'Ha ocurrido un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
          ),
          variant: 'destructive',
        });
      });
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`rounded-[32px] bg-[image:var(--gradient-brand)] p-px transition-all duration-500 ${
        hasIntersected ? 'translate-y-0 opacity-100 hover:scale-[1.01]' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay * 150}ms` }}
    >
      <div className="rounded-[31px] bg-[var(--bg-surface)] p-5 shadow-xl backdrop-blur-md sm:p-8">
        <h3 className="mb-6 text-xl font-black text-white sm:text-2xl">
          Contanos tu proyecto
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-[var(--bg-elevated)]/82 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--signal)] ${
                errors.name ? 'border-red-500' : 'border-[var(--border-default)]'
              }`}
              placeholder="Tu nombre"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email-contact" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email-contact"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-[var(--bg-elevated)]/82 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--signal)] ${
                errors.email ? 'border-red-500' : 'border-[var(--border-default)]'
              }`}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              rows={4}
              className={`w-full resize-none rounded-lg border bg-[var(--bg-elevated)]/82 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--signal)] ${
                errors.message ? 'border-red-500' : 'border-[var(--border-default)]'
              }`}
              placeholder="Tu mensaje aquí..."
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitState === 'submitting'}
            onClick={trackContactFormClick}
            className="glow-violet w-full rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {submitState === 'submitting'
              ? 'Enviando...'
              : submitState === 'sent'
                ? 'Enviado'
                : 'Enviar consulta →'}
          </button>
        </form>
      </div>
    </div>
  );
}

interface ContactInfoProps {
  delay: number;
}

function ContactInfo({ delay }: ContactInfoProps) {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`text-left transition-all duration-500 ${
        hasIntersected ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay * 150}ms` }}
    >
      <h3 className="mb-6 text-xl font-black text-white sm:text-2xl">
        CONTACTO DIRECTO
      </h3>

      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-lg" aria-hidden="true">
            📱
          </span>
          <a
            href={`tel:${TUWEBAI_WHATSAPP_TEL}`}
            onClick={trackContactPhoneClick}
            className="text-gray-300 transition-colors hover:text-white"
          >
            {TUWEBAI_WHATSAPP_DISPLAY}
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-lg" aria-hidden="true">
            📧
          </span>
          <a
            href={`mailto:${TUWEBAI_EMAIL}`}
            onClick={trackContactEmailClick}
            className="text-gray-300 transition-colors hover:text-white"
          >
            {TUWEBAI_EMAIL}
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-lg" aria-hidden="true">
            🕐
          </span>
          <span className="text-gray-300">{TUWEBAI_BUSINESS_HOURS}</span>
        </div>
      </div>

      <h4 className="mb-4 text-xl font-black text-white">
        QUÉ PASA DESPUÉS DE QUE ENVIÁS
      </h4>

      <ul className="space-y-3">
        <li className="text-gray-300">→ Te respondemos en menos de 24hs</li>
        <li className="text-gray-300">→ Una llamada o chat de 20 minutos para entender tu proyecto</li>
        <li className="text-gray-300">→ Te decimos si podemos ayudarte y cómo, sin rodeos</li>
        <li className="text-gray-300">→ Presupuesto cerrado por escrito antes de que pagues un peso</li>
      </ul>

      <div className="mt-8 border-t border-white/10 pt-4">
        <h5 className="mb-3 font-medium text-white">¿PREFERÍS HABLAR AHORA?</h5>
        <RouterLink
          to="/consulta"
          className="inline-flex items-center text-[var(--signal)] hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Ir a consulta →
        </RouterLink>
      </div>
    </div>
  );
}

interface ContactSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ContactSection({ setRef }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } =
    useIntersectionObserver<HTMLDivElement>();
  useTrackSectionView(sectionRef, 'contact');

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-transparent"
    >
      <AnimatedShape type={1} className="top-[20%] left-[-150px]" delay={1} />
      <AnimatedShape type={2} className="bottom-[10%] right-[-100px]" delay={2} />
      <div className="pointer-events-none absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full bg-[var(--signal)]/12 blur-3xl" />

      <div className="container z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16">
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`mb-12 text-center transition-all duration-700 sm:mb-16 ${
            titleVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mb-5 inline-flex rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#A78BFA]">
            Empecemos
          </div>
          <h2 className="mb-6 text-3xl font-black sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Hablemos de tu proyecto.
              <br />
              Sin compromiso, sin cargo.
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
            Contanos qué necesita tu negocio y te respondemos en menos de 24 horas con un
            diagnóstico claro.
          </p>
        </div>

        <div className="noise-overlay relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/8 bg-[var(--bg-surface)] p-6 md:p-8">
          <span className="absolute left-5 top-5 h-10 w-10 rounded-tl-3xl border-l border-t border-[var(--signal-border)]" />
          <span className="absolute bottom-5 right-5 h-10 w-10 rounded-br-3xl border-b border-r border-[var(--signal-border)]" />
          <div className="relative mb-8 text-center text-sm text-gray-400">
            Respuesta en menos de 24h · Diagnóstico claro · Ruta directa a /consulta
          </div>
          <div className="relative grid gap-8 md:grid-cols-2">
            <ContactForm delay={1} />
            <ContactInfo delay={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
