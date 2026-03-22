import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Gauge, MonitorSmartphone, Search, SendHorizontal } from 'lucide-react';

import {
  getContactErrorMessage,
  getContactFieldErrors,
} from '@/features/contact/services/contact.service';
import { useContactSubmission } from '@/features/contact/hooks/use-contact-submission';
import { cn } from '@/lib/utils';
import {
  TUWEBAI_EMAIL,
  TUWEBAI_SITE_FULL_URL,
  TUWEBAI_WHATSAPP_NUMBER,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';
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
    provider: {
      '@type': 'LocalBusiness',
      name: 'TuWebAI',
    },
    description:
      'Revisión gratuita del sitio web para identificar problemas de velocidad, conversión y SEO básico.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ARS',
    },
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
        title="Diagnóstico Web Gratuito"
        description="Revisamos tu web sin cargo y te decimos exactamente qué está frenando tus consultas. Velocidad, conversión y SEO básico. Sin compromiso."
        keywords="diagnóstico web gratuito, auditoría web inicial, velocidad web, conversión web, SEO básico, TuWebAI"
        url={`${TUWEBAI_SITE_FULL_URL}/diagnostico-gratuito`}
        ogType="website"
        structuredData={DIAGNOSTICO_STRUCTURED_DATA}
      />

      <main className="relative overflow-hidden bg-[#0a0a0f] text-white">
        <AnimatedShape type={1} className="left-[-170px] top-16" delay={0.2} />
        <AnimatedShape type={2} className="right-[-140px] top-[28rem]" delay={0.5} />

        <section className="relative border-b border-white/10 px-4 pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="mx-auto max-w-5xl">
            <Badge className="mb-6 border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#9BE7FF]">
              Gratis · Sin compromiso
            </Badge>

            <h1 className="max-w-3xl font-rajdhani text-4xl font-bold leading-none text-white sm:text-5xl md:text-6xl">
              Descubrí qué está frenando
              <br />
              las consultas de tu web.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
              Revisamos tu sitio y te decimos exactamente qué está fallando: sin rodeos, sin cargo
              y sin obligación de contratar.
            </p>

            <div className="mt-8">
              <a
                href="#formulario-diagnostico"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00CCFF]/20 transition-transform duration-200 hover:scale-[1.02]"
              >
                Quiero mi diagnóstico gratuito →
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">
                Qué incluye el diagnóstico
              </p>
              <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
                Tres señales claras para saber si tu web está frenando ventas.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {DIAGNOSIS_FEATURES.map(({ title, description, icon: Icon }) => (
                <Card
                  key={title}
                  className="border-white/10 bg-[linear-gradient(180deg,rgba(19,19,28,0.92)_0%,rgba(12,12,18,0.96)_100%)] text-white shadow-[0_20px_50px_rgba(0,0,0,0.24)]"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00CCFF]/12 text-[#9BE7FF]">
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
          className="border-y border-white/10 bg-[linear-gradient(180deg,rgba(17,17,25,0.95)_0%,rgba(10,10,15,0.98)_100%)] px-4 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">Formulario</p>
              <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
                Completá el formulario y te respondemos
                <br />
                en menos de 24 horas.
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0f1017]/92 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)] sm:p-8">
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
                      <Link to="/proceso" className="text-[#9BE7FF] underline underline-offset-4">
                        /proceso
                      </Link>
                      .
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setSubmitState('idle')}
                    className="min-h-11 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 text-white"
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
                        'min-h-11 border-white/10 bg-[#12131b] text-white placeholder:text-gray-500',
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
                        'min-h-11 border-white/10 bg-[#12131b] text-white placeholder:text-gray-500',
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
                        'min-h-11 border-white/10 bg-[#12131b] text-white placeholder:text-gray-500',
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
                            'flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-[#12131b] px-4 py-3 text-sm text-gray-300 transition-colors hover:border-[#00CCFF]/40 hover:bg-[#151826]',
                            form.mainProblem === option && 'border-[#00CCFF]/60 bg-[#00CCFF]/10 text-white',
                          )}
                        >
                          <RadioGroupItem value={option} className="mt-1 border-[#00CCFF] text-[#00CCFF]" />
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
                        'min-h-[132px] border-white/10 bg-[#12131b] text-white placeholder:text-gray-500',
                        errors.message && 'border-red-400 focus-visible:ring-red-400',
                      )}
                    />
                    {errors.message && <p className="text-sm text-red-300">{errors.message}</p>}
                  </div>

                  <div className="space-y-3 pt-2 text-center">
                    <Button
                      type="submit"
                      disabled={submitState === 'submitting'}
                      className="min-h-11 w-full rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 text-base font-semibold text-white"
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
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">
              Por qué hacemos esto gratis
            </p>
            <div className="space-y-5 text-base leading-8 text-gray-300 sm:text-lg">
              <p>No lo hacemos por filantropía.</p>
              <p>
                Lo hacemos porque el 90% de los negocios que hablan con nosotros no saben
                exactamente qué tiene roto su web. El diagnóstico resuelve eso antes de que arranque
                cualquier conversación comercial.
              </p>
              <p>Si podemos ayudarte, te lo vamos a decir. Si no podemos, también.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,28,0.92)_0%,rgba(11,11,17,0.96)_100%)] p-8 text-center shadow-[0_30px_70px_rgba(0,0,0,0.28)]">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">
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
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/12 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#25D366]/20"
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
