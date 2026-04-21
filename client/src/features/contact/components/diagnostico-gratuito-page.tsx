import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Gauge, MonitorSmartphone, Search, SendHorizontal } from 'lucide-react';

import {
  getContactErrorMessage,
  getContactFieldErrors,
} from '@/features/contact/services/contact.service';
import { useContactSubmission } from '@/features/contact/hooks/use-contact-submission';
import {
  trackFreeDiagnosisFormClick,
  trackFreeDiagnosisFormSubmit,
  trackFreeDiagnosisHeroClick,
  trackFreeDiagnosisWhatsAppClick,
} from '@/features/contact/services/contact-analytics.service';
import { cn } from '@/lib/utils';
import {
  TUWEBAI_EMAIL,
  TUWEBAI_SITE_FULL_URL,
  TUWEBAI_WHATSAPP_NUMBER,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import AnimatedShape from '@/shared/ui/animated-shape';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import MetaTags from '@/shared/ui/meta-tags';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Textarea } from '@/shared/ui/textarea';

type SubmitState = 'idle' | 'submitting' | 'sent';

interface DiagnosisFormState {
  name: string;
  email: string;
  website: string;
  mainProblem: string;
  message: string;
}

type DiagnosisFieldErrors = Partial<Record<keyof DiagnosisFormState, string>>;
type FeedbackState = { type: 'error'; message: string } | null;

const DIAGNOSIS_FEATURES = [
  {
    title: 'Análisis de velocidad',
    description:
      'Medimos el tiempo de carga real en mobile y te decimos si está costándote clientes.',
    icon: Gauge,
  },
  {
    title: 'Revisión de conversión',
    description:
      'Evaluamos si tu web tiene lo mínimo para convertir: CTA visible, formulario accesible y mensaje claro.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Diagnóstico SEO básico',
    description:
      'Verificamos si Google puede encontrarte y si tu perfil de Google Business está completo.',
    icon: Search,
  },
] as const;

const DIAGNOSIS_PROBLEM_OPTIONS = [
  'No recibo consultas',
  'Carga lento',
  'No aparece en Google',
  'No sé si está funcionando bien',
  'No tengo web todavía',
  'Otro',
] as const;

const DIAGNOSTICO_STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Diagnóstico Web Gratuito',
    alternateName: 'Diagnóstico gratuito de sitio web',
    provider: {
      '@type': 'LocalBusiness',
      name: 'TuWebAI',
      url: TUWEBAI_SITE_FULL_URL,
    },
    description:
      'Revisión gratuita del sitio web para identificar problemas de velocidad, conversión y SEO básico. Sin cargo y sin compromiso.',
    url: `${TUWEBAI_SITE_FULL_URL}/diagnostico-gratuito`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      description: 'Diagnóstico gratuito sin cargo ni compromiso',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Argentina',
    },
    serviceType: 'Diagnóstico web',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Qué incluye el diagnóstico',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Análisis de velocidad de carga',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Revisión de conversión y CTA',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Diagnóstico SEO básico',
          },
        },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿El diagnóstico es realmente gratis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, completamente gratis y sin compromiso. No hay ningún costo oculto ni obligación de contratar después.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto tarda en llegar el diagnóstico?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Respondemos en menos de 24 horas hábiles con un resumen de los principales problemas encontrados.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué incluye el diagnóstico gratuito?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Revisamos velocidad de carga en mobile, elementos de conversión y diagnóstico SEO básico para detectar qué frena las consultas.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Necesito tener una web para pedir el diagnóstico?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Si no tenés web todavía, igualmente podemos evaluar tu presencia digital actual y recomendarte el mejor punto de partida.',
        },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: TUWEBAI_SITE_FULL_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Diagnóstico gratuito',
        item: `${TUWEBAI_SITE_FULL_URL}/diagnostico-gratuito`,
      },
    ],
  },
];

const DIAGNOSTICO_FAQS = [
  {
    value: 'faq-1',
    question: '¿El diagnóstico es realmente gratis?',
    answer:
      'Sí, completamente gratis y sin compromiso. No hay ningún costo oculto ni obligación de contratar después.',
  },
  {
    value: 'faq-2',
    question: '¿Cuánto tarda en llegar el diagnóstico?',
    answer:
      'Respondemos en menos de 24 horas hábiles con un resumen de los principales problemas encontrados.',
  },
  {
    value: 'faq-3',
    question: '¿Qué incluye el diagnóstico gratuito?',
    answer:
      'Revisamos velocidad de carga en mobile, elementos de conversión como CTA visible y formulario accesible, y un diagnóstico SEO básico para detectar qué falla en tu web.',
  },
  {
    value: 'faq-4',
    question: '¿Necesito tener una web para pedir el diagnóstico?',
    answer:
      'No. Si no tenés web todavía, igualmente podemos evaluar tu presencia digital actual y recomendarte el mejor punto de partida para tu negocio en Argentina.',
  },
] as const;

const INITIAL_FORM_STATE: DiagnosisFormState = {
  name: '',
  email: '',
  website: '',
  mainProblem: '',
  message: '',
};

const EMAIL_REGEX = /\S+@\S+\.\S+/;

function getProblemLabel(value: string) {
  return DIAGNOSIS_PROBLEM_OPTIONS.find((option) => option === value) ?? 'Sin especificar';
}

function isValidWebsite(value: string) {
  if (!value.trim()) {
    return true;
  }

  if (value.trim().toLowerCase() === 'no tengo') {
    return true;
  }

  try {
    const candidate = value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
    const url = new URL(candidate);
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}

export default function DiagnosticoGratuitoPage() {
  const { submitContactForm } = useContactSubmission();
  const [form, setForm] = useState<DiagnosisFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<DiagnosisFieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [successEmail, setSuccessEmail] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const whatsappHref = useMemo(() => {
    const message = encodeURIComponent(
      'Hola, quiero hablar directo por WhatsApp sobre el diagnóstico gratuito de mi web.',
    );

    return `${TUWEBAI_WHATSAPP_URL}?text=${message}`;
  }, []);

  const handleInputChange = (field: keyof DiagnosisFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (feedback) {
      setFeedback(null);
    }

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const nextErrors: DiagnosisFieldErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'El nombre es requerido.';
    } else if (form.name.trim().length < 2) {
      nextErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'El email es requerido.';
    } else if (!EMAIL_REGEX.test(form.email)) {
      nextErrors.email = 'Ingresá un email válido.';
    }

    if (!isValidWebsite(form.website)) {
      nextErrors.website = 'Ingresá una URL válida o escribí "No tengo".';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitState('submitting');
    setErrors({});
    setFeedback(null);

    const website = form.website.trim() || 'No tengo';
    const problem = getProblemLabel(form.mainProblem);
    const additionalMessage = form.message.trim() || 'Sin mensaje adicional.';

    try {
      await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        title: `Diagnóstico gratuito: ${problem}`,
        message: [
          `Sitio web: ${website}`,
          `Problema principal: ${problem}`,
          `Canal de origen: diagnóstico gratuito`,
          '',
          'Mensaje adicional:',
          additionalMessage,
        ].join('\n'),
        source: 'diagnostico_gratuito',
      });

      setSuccessEmail(form.email.trim());
      setSubmitState('sent');
      setForm(INITIAL_FORM_STATE);
      trackFreeDiagnosisFormSubmit();
    } catch (error) {
      const serverErrors = getContactFieldErrors(error);
      const nextErrors: DiagnosisFieldErrors = {};

      if (serverErrors.name) {
        nextErrors.name = serverErrors.name;
      }

      if (serverErrors.email) {
        nextErrors.email = serverErrors.email;
      }

      if (serverErrors.message) {
        nextErrors.message = serverErrors.message;
      }

      setErrors(nextErrors);
      setSubmitState('idle');
      setFeedback({
        type: 'error',
        message: getContactErrorMessage(
          error,
          `No pudimos enviar tu solicitud a ${TUWEBAI_EMAIL}. Intentá de nuevo.`,
        ),
      });
    }
  };

  return (
    <>
      <MetaTags
        title="Diagnóstico Web Gratuito | TuWebAI — Descubrí qué falla en tu sitio"
        description="Revisamos tu web sin cargo y te decimos exactamente qué está frenando tus consultas. Velocidad, conversión y SEO básico. Sin compromiso. Respondemos en menos de 24 horas."
        keywords="diagnóstico web gratuito, auditoría web inicial, velocidad web, conversión web, SEO básico, TuWebAI"
        url={`${TUWEBAI_SITE_FULL_URL}/diagnostico-gratuito`}
        ogType="website"
        disableTitleSuffix
        ogTitle="Diagnóstico Web Gratuito | TuWebAI"
        ogDescription="Descubrí qué está frenando las consultas de tu web. Sin cargo, sin compromiso."
        twitterTitle="Diagnóstico Web Gratuito | TuWebAI"
        twitterDescription="Descubrí qué está frenando las consultas de tu web."
        ogSiteName="TuWebAI"
        ogImage="/logo-tuwebai.webp"
        structuredData={DIAGNOSTICO_STRUCTURED_DATA}
      />

      <main className="page-shell-surface relative overflow-hidden text-white">
        <AnimatedShape type={1} className="left-[-170px] top-16" delay={0.2} />
        <AnimatedShape type={2} className="right-[-140px] top-[28rem]" delay={0.5} />

        <section className="relative border-b border-white/10 px-4 pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="mx-auto max-w-5xl">
            <Badge className="mb-6 border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--signal)]">
              Gratis · Sin compromiso
            </Badge>

            <h1 className="max-w-3xl font-rajdhani text-4xl font-bold leading-none text-white sm:text-5xl md:text-6xl">
              Descubrí qué está frenando
              <br />
              las consultas de tu web.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
              En TuWebAI revisamos tu sitio y te decimos exactamente qué falla en tu web: sin
              rodeos, sin cargo, sin compromiso y con respuesta en menos de 24 horas para negocios
              de Argentina.
            </p>

            <div className="mt-8">
              <a
                href="#formulario-diagnostico"
                onClick={trackFreeDiagnosisHeroClick}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)] transition-transform duration-200 hover:scale-[1.02]"
              >
                Quiero mi diagnóstico gratuito →
              </a>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
              ¿Querés hacer una auditoría web inicial por tu cuenta antes de pedir ayuda? Probá el{' '}
              <Link
                to="/checklist-web-gratis"
                className="font-semibold text-[var(--signal)] transition hover:text-white"
              >
                Checklist web gratuito de 35 puntos →
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--signal)]">
                Qué incluye el diagnóstico
              </p>
              <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
                Tres señales claras para saber si tu web está frenando consultas y ventas.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">
                Este diagnóstico web gratuito de TuWebAI está pensado para negocios argentinos que
                necesitan detectar rápido qué falla en su web antes de seguir invirtiendo en
                campañas o tráfico sin retorno.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {DIAGNOSIS_FEATURES.map(({ title, description, icon: Icon }) => (
                <Card key={title} className="editorial-surface-card text-white shadow-[var(--shadow-elevated)]">
                  <CardHeader className="space-y-4">
                    <div className="editorial-surface-card editorial-surface-card--accent flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--signal)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-rajdhani text-2xl">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-7 text-gray-300">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="formulario-diagnostico"
          className="border-y border-white/10 bg-[var(--bg-overlay)] px-4 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--signal)]">Formulario</p>
              <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
                Completá el formulario y te respondemos
                <br />
                en menos de 24 horas.
              </h2>
            </div>

            <div className="editorial-surface-panel rounded-[28px] p-6 shadow-[var(--shadow-modal)] sm:p-8">
              {submitState === 'sent' ? (
                <div className="space-y-5 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <SendHorizontal className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-rajdhani text-3xl font-bold text-white">
                      ¡Listo! Recibimos tu solicitud.
                    </h3>
                    <p className="text-base leading-7 text-gray-300">
                      Te respondemos en menos de 24 horas a <span className="text-white">{successEmail}</span>.
                      Mientras tanto, podés ver cómo trabajamos en{' '}
                      <Link to="/proceso" className="text-[var(--signal)] underline underline-offset-4">
                        /proceso
                      </Link>
                      .
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setSubmitState('idle')}
                    className="min-h-11 rounded-full bg-[image:var(--gradient-brand)] px-6 text-white shadow-[var(--glow-signal)]"
                  >
                    Enviar otra solicitud
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {feedback && (
                    <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {feedback.message}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="diagnostico-nombre" className="block text-sm font-medium text-gray-200">
                      Nombre completo *
                    </label>
                    <Input
                      id="diagnostico-nombre"
                      value={form.name}
                      onChange={(event) => handleInputChange('name', event.target.value)}
                      placeholder="Tu nombre"
                      autoComplete="name"
                      className={cn(
                        'min-h-11 border-white/10 bg-[var(--bg-elevated)] text-white placeholder:text-gray-500',
                        errors.name && 'border-red-400 focus-visible:ring-red-400',
                      )}
                    />
                    {errors.name && <p className="text-sm text-red-300">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="diagnostico-email" className="block text-sm font-medium text-gray-200">
                      Email *
                    </label>
                    <Input
                      id="diagnostico-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => handleInputChange('email', event.target.value)}
                      placeholder="tu@email.com"
                      autoComplete="email"
                      className={cn(
                        'min-h-11 border-white/10 bg-[var(--bg-elevated)] text-white placeholder:text-gray-500',
                        errors.email && 'border-red-400 focus-visible:ring-red-400',
                      )}
                    />
                    {errors.email && <p className="text-sm text-red-300">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="diagnostico-web" className="block text-sm font-medium text-gray-200">
                      URL de tu sitio web *
                    </label>
                    <Input
                      id="diagnostico-web"
                      value={form.website}
                      onChange={(event) => handleInputChange('website', event.target.value)}
                      placeholder="https://tusitio.com"
                      inputMode="url"
                      className={cn(
                        'min-h-11 border-white/10 bg-[var(--bg-elevated)] text-white placeholder:text-gray-500',
                        errors.website && 'border-red-400 focus-visible:ring-red-400',
                      )}
                    />
                    <p className="text-sm leading-6 text-gray-400">
                      Si no tenés web todavía, podés dejarlo en blanco o escribir "No tengo".
                    </p>
                    {errors.website && <p className="text-sm text-red-300">{errors.website}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-200">
                      ¿Cuál es el problema principal que tenés con tu web?
                    </label>
                    <RadioGroup
                      value={form.mainProblem}
                      onValueChange={(value) => handleInputChange('mainProblem', value)}
                      className="grid gap-3"
                    >
                      {DIAGNOSIS_PROBLEM_OPTIONS.map((option) => (
                        <label
                          key={option}
                          className={cn(
                            'editorial-surface-card editorial-surface-card--interactive flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 text-sm text-gray-300 transition-colors',
                            form.mainProblem === option && 'border-[var(--signal-border)] bg-[var(--signal-glow)] text-white',
                          )}
                        >
                          <RadioGroupItem value={option} className="mt-1 border-[var(--signal)] text-[var(--signal)]" />
                          <span>{option}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="diagnostico-mensaje" className="block text-sm font-medium text-gray-200">
                      Mensaje adicional (opcional)
                    </label>
                    <Textarea
                      id="diagnostico-mensaje"
                      value={form.message}
                      onChange={(event) => handleInputChange('message', event.target.value)}
                      placeholder="Contanos cualquier detalle extra que quieras que sepamos"
                      rows={5}
                      className={cn(
                        'min-h-[132px] border-white/10 bg-[var(--bg-elevated)] text-white placeholder:text-gray-500',
                        errors.message && 'border-red-400 focus-visible:ring-red-400',
                      )}
                    />
                    {errors.message && <p className="text-sm text-red-300">{errors.message}</p>}
                  </div>

                  <div className="space-y-3 pt-2 text-center">
                    <Button
                      type="submit"
                      disabled={submitState === 'submitting'}
                      onClick={trackFreeDiagnosisFormClick}
                      className="min-h-11 w-full rounded-full bg-[image:var(--gradient-brand)] px-6 text-base font-semibold text-white shadow-[var(--glow-signal)]"
                    >
                      {submitState === 'submitting'
                        ? 'Enviando...'
                        : 'Quiero mi diagnóstico gratuito →'}
                    </Button>
                    <p className="text-sm text-gray-400">
                      Te respondemos en menos de 24 horas · Sin cargo · Sin compromiso
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--signal)]">
              Por qué hacemos esto gratis
            </p>
            <div className="space-y-5 text-base leading-8 text-gray-300 sm:text-lg">
              <p>No lo hacemos por filantropía.</p>
              <p>
                Lo hacemos porque el 90% de los negocios que hablan con nosotros no saben
                exactamente qué tiene roto su web. El diagnóstico web gratuito resuelve eso antes de
                que arranque cualquier conversación comercial con TuWebAI.
              </p>
              <p>Si podemos ayudarte, te lo vamos a decir. Si no podemos, también.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--signal)]">
                Preguntas frecuentes
              </p>
              <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
                Lo que suelen preguntar antes de pedir el diagnóstico.
              </h2>
            </div>

            <div className="editorial-surface-panel mt-10 rounded-[28px] p-3 sm:p-4">
              <Accordion type="single" collapsible className="w-full">
                {DIAGNOSTICO_FAQS.map((faq) => (
                  <AccordionItem key={faq.value} value={faq.value} className="border-white/10 px-3">
                    <AccordionTrigger className="text-left font-rajdhani text-xl font-bold text-white hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-7 text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-16 sm:py-20">
          <div className="editorial-surface-panel mx-auto max-w-4xl rounded-[28px] p-8 text-center shadow-[var(--shadow-modal)]">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[var(--signal)]">
              CTA directo
            </p>
            <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
              ¿Preferís hablar directamente?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-300">
              Si querés ir por el camino corto, escribinos por WhatsApp y vemos si el diagnóstico
              aplica a tu caso.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackFreeDiagnosisWhatsAppClick(whatsappHref)}
                className="editorial-secondary-button inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                <BarChart3 className="h-4 w-4" />
                Escribinos por WhatsApp →
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">Canal directo: +{TUWEBAI_WHATSAPP_NUMBER}</p>
          </div>
        </section>
      </main>
    </>
  );
}
