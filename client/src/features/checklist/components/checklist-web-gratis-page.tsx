import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownToLine, CheckCircle2, Download } from 'lucide-react';

import { useChecklistDownloadSubmission } from '@/features/checklist/hooks/use-checklist-download-submission';
import { getChecklistWebGratisErrorMessage } from '@/features/checklist/services/checklist-download.service';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import AnimatedShape from '@/shared/ui/animated-shape';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import MetaTags from '@/shared/ui/meta-tags';
import { Progress } from '@/shared/ui/progress';
import { Separator } from '@/shared/ui/separator';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';

interface ChecklistCategory {
  id: string;
  title: string;
  items: string[];
}

interface DownloadFormState {
  name: string;
  email: string;
}

const CHECKLIST_PDF_PATH = '/checklist-web-tuwebai-branded.pdf';

const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  {
    id: 'velocidad',
    title: 'Velocidad y performance',
    items: [
      'La web carga en menos de 3 segundos en celular con datos móviles',
      'Las imágenes están comprimidas y en formato WebP',
      'No hay scripts de terceros bloqueando el render inicial',
      'El puntaje de PageSpeed en mobile es mayor a 70',
      'No hay fuentes externas cargando sin display=swap',
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile y responsive',
    items: [
      'El diseño se ve correctamente en pantallas de 375px de ancho',
      'Los botones tienen al menos 44px de área táctil',
      'El texto es legible sin necesidad de hacer zoom',
      'Los formularios son usables desde el teclado del celular',
      'No hay elementos que se superpongan o se corten en mobile',
    ],
  },
  {
    id: 'conversion',
    title: 'Conversión y CTAs',
    items: [
      'Hay un CTA visible sin necesidad de hacer scroll en la home',
      'El CTA dice exactamente qué pasa cuando se hace clic',
      'Hay un número de WhatsApp o botón de contacto siempre visible',
      'El formulario de contacto tiene 5 campos o menos',
      'La página de inicio deja claro qué hace el negocio en 5 segundos',
    ],
  },
  {
    id: 'seo',
    title: 'SEO básico',
    items: [
      'Cada página tiene un título único y descriptivo',
      'Cada página tiene una meta description única',
      'El sitio tiene un sitemap.xml enviado a Google Search Console',
      'El sitio está verificado en Google Search Console',
      'Google Business Profile está completo y verificado',
    ],
  },
  {
    id: 'contenido',
    title: 'Contenido y mensaje',
    items: [
      'La propuesta de valor está clara en el hero de la home',
      'Los servicios tienen descripciones específicas, no genéricas',
      'Hay al menos 3 testimonios o casos reales visibles',
      'Los precios o rangos de precio son accesibles sin tener que consultar',
      'El "nosotros" humaniza la empresa con nombres y fotos reales',
    ],
  },
  {
    id: 'tecnico',
    title: 'Técnico y seguridad',
    items: [
      'El sitio tiene HTTPS activo (candado verde en el navegador)',
      'No hay errores 404 en páginas importantes',
      'El sitio tiene robots.txt configurado correctamente',
      'Las imágenes tienen texto alternativo (alt text)',
      'El HTML tiene el atributo lang definido correctamente',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics y medición',
    items: [
      'Google Analytics o equivalente está instalado y verificado',
      'Las conversiones (formularios, clics en WhatsApp) están trackeadas',
      'Se revisan las métricas del sitio al menos una vez por mes',
      'Se sabe de dónde viene el tráfico (orgánico, redes, directo)',
      'Se conoce la tasa de conversión actual del sitio',
    ],
  },
];

const TOTAL_ITEMS = CHECKLIST_CATEGORIES.reduce((sum, category) => sum + category.items.length, 0);

const CHECKLIST_BENEFITS = [
  {
    title: 'Auditá tu web en 10 minutos',
    text: '35 preguntas organizadas por área. Sin conocimientos técnicos necesarios.',
  },
  {
    title: 'Identificá los problemas reales',
    text: 'Cada ítem que no podés marcar como completado es un problema que está costándote consultas.',
  },
  {
    title: 'Sabé exactamente qué priorizar',
    text: 'Los ítems están ordenados por impacto en conversión: los más importantes primero.',
  },
];

const CHECKLIST_HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo auditar tu sitio web en 10 minutos',
  description:
    'Checklist de 35 puntos para evaluar velocidad, mobile, conversión, SEO y analytics de cualquier sitio web.',
  totalTime: 'PT10M',
  supply: [],
  tool: [],
  step: CHECKLIST_CATEGORIES.map((category, categoryIndex) => ({
    '@type': 'HowToSection',
    name: category.title,
    position: categoryIndex + 1,
    itemListElement: category.items.map((item, itemIndex) => ({
      '@type': 'HowToStep',
      position: itemIndex + 1,
      text: item,
    })),
  })),
};

const CHECKLIST_BREADCRUMB_SCHEMA = {
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
      name: 'Checklist web gratis',
      item: `${TUWEBAI_SITE_FULL_URL}/checklist-web-gratis`,
    },
  ],
};

const INITIAL_FORM_STATE: DownloadFormState = {
  name: '',
  email: '',
};

function getResultContent(completedCount: number) {
  if (completedCount <= 12) {
    return {
      title: 'Tu web tiene problemas críticos que están frenando tus consultas.',
      description:
        'La buena noticia: la mayoría tiene solución concreta si atacás primero velocidad, mobile y conversión.',
      href: '/diagnostico-gratuito',
      cta: 'Pedí un diagnóstico gratuito →',
    };
  }

  if (completedCount <= 24) {
    return {
      title: 'Tu web tiene una base sólida pero hay oportunidades claras de mejora.',
      description:
        'Con los cambios correctos podés aumentar significativamente tus consultas sin rehacer todo desde cero.',
      href: '/contacto',
      cta: 'Hablemos de cómo mejorarlo →',
    };
  }

  return {
    title: 'Tu web está bien optimizada.',
    description:
      'Si aun así no recibís las consultas que esperás, el problema puede estar en el tráfico o en el mensaje.',
    href: '/contacto',
    cta: 'Hablemos →',
  };
}

export default function ChecklistWebGratisPage() {
  const { requestChecklistWebGratis } = useChecklistDownloadSubmission();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<DownloadFormState>(INITIAL_FORM_STATE);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState('');

  const completedCount = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems],
  );
  const progressValue = (completedCount / TOTAL_ITEMS) * 100;
  const result = getResultContent(completedCount);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handleToggleItem = (itemId: string, nextValue: boolean) => {
    setCheckedItems((current) => ({
      ...current,
      [itemId]: nextValue,
    }));
  };

  const handleFormChange = (field: keyof DownloadFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (feedback) {
      setFeedback(null);
    }
  };

  const handleDownloadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setFeedback('Ingresá tu nombre para mandarte el checklist.');
      return;
    }

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setFeedback('Ingresá un email válido para recibir el checklist.');
      return;
    }

    setSubmitState('submitting');
    setFeedback(null);

    try {
      await requestChecklistWebGratis({
        name: form.name.trim(),
        email: form.email.trim(),
        source: 'checklist_web_gratis',
      });

      setSuccessEmail(form.email.trim());
      setSubmitState('sent');
      setForm(INITIAL_FORM_STATE);
    } catch (error) {
      setSubmitState('idle');
      setFeedback(
        getChecklistWebGratisErrorMessage(
          error,
          'No pudimos procesar la descarga en este momento. Intentá de nuevo.',
        ),
      );
    }
  };

  return (
    <>
      <MetaTags
        title="Checklist Web Gratis | TuWebAI — 35 puntos para auditar tu sitio"
        description="Descargá gratis el checklist de 35 puntos que usamos en TuWebAI para auditar sitios web. Velocidad, mobile, conversión, SEO y más. Sin registro obligatorio."
        keywords="checklist web gratis, auditoría web, checklist sitio web, conversión web, seo técnico, TuWebAI"
        url={`${TUWEBAI_SITE_FULL_URL}/checklist-web-gratis`}
        ogType="website"
        disableTitleSuffix
        ogTitle="Checklist Web Gratis | TuWebAI"
        ogDescription="35 puntos para saber si tu web está lista para vender."
        twitterTitle="Checklist Web Gratis | TuWebAI"
        twitterDescription="35 puntos para auditar tu sitio y detectar qué está frenando tus consultas."
        ogSiteName="TuWebAI"
        ogImage="/logo-tuwebai.png"
        structuredData={[CHECKLIST_HOWTO_SCHEMA, CHECKLIST_BREADCRUMB_SCHEMA]}
      />

      <main className="relative overflow-hidden bg-[#0a0a0f] text-white">
        <AnimatedShape type={1} className="left-[-180px] top-20" delay={0.2} />
        <AnimatedShape type={2} className="right-[-140px] top-[34rem]" delay={0.45} />

        <section className="relative border-b border-white/10 px-4 pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="mx-auto max-w-5xl">
            <Badge className="mb-6 border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#9BE7FF]">
              Gratis · Descarga instantánea
            </Badge>

            <h1 className="max-w-4xl font-rajdhani text-4xl font-bold leading-none sm:text-5xl md:text-6xl">
              35 puntos para saber si tu web
              <br />
              está lista para vender.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
              El checklist que usamos en TuWebAI para auditar cada sitio antes de arrancar un
              proyecto. Ahora disponible para que lo uses vos mismo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#formulario"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,204,255,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Descargar el checklist →
              </a>
              <a
                href="#checklist-interactivo"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#DCE7FF] transition-colors duration-200 hover:border-[#00CCFF]/45 hover:text-white"
              >
                Usarlo online gratis
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">Para qué sirve</p>
              <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
                Una auditoría rápida para detectar qué está frenando tus consultas.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {CHECKLIST_BENEFITS.map((benefit) => (
                <Card
                  key={benefit.title}
                  className="border-white/10 bg-[linear-gradient(180deg,rgba(19,19,28,0.92)_0%,rgba(12,12,18,0.96)_100%)] text-white shadow-[0_20px_50px_rgba(0,0,0,0.24)]"
                >
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-2xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-7 text-gray-300">{benefit.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="checklist-interactivo"
          className="border-y border-white/10 bg-[linear-gradient(180deg,rgba(17,17,25,0.95)_0%,rgba(10,10,15,0.98)_100%)] px-4 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">
                Checklist interactivo
              </p>
              <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">El checklist completo</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-4">
                <Accordion type="multiple" className="space-y-4">
                  {CHECKLIST_CATEGORIES.map((category, categoryIndex) => (
                    <AccordionItem
                      key={category.id}
                      value={category.id}
                      className="overflow-hidden rounded-[24px] border border-white/10 bg-[#10111a]/92 text-white shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                    >
                      <AccordionTrigger className="px-6 py-5 text-left hover:no-underline">
                        <span className="flex items-center gap-3 pr-4">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#00CCFF]/25 bg-[#00CCFF]/10 text-sm font-semibold text-[#9BE7FF]">
                            {categoryIndex + 1}
                          </span>
                          <span className="font-rajdhani text-2xl font-bold">{category.title}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4">
                          {category.items.map((item, itemIndex) => {
                            const itemId = `${category.id}-${itemIndex}`;
                            const checked = Boolean(checkedItems[itemId]);

                            return (
                              <label
                                key={itemId}
                                htmlFor={itemId}
                                className={cn(
                                  'flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors',
                                  checked
                                    ? 'border-[#00CCFF]/45 bg-[#00CCFF]/10'
                                    : 'border-white/8 bg-white/[0.02] hover:border-[#00CCFF]/30',
                                )}
                              >
                                <Checkbox
                                  id={itemId}
                                  checked={checked}
                                  onCheckedChange={(value) => handleToggleItem(itemId, value === true)}
                                  className="mt-1 h-5 w-5 border-[#00CCFF]/60 data-[state=checked]:bg-[#00CCFF] data-[state=checked]:text-[#0a0a0f]"
                                />
                                <span
                                  className={cn(
                                    'text-sm leading-7 text-gray-200 sm:text-base',
                                    checked && 'text-white line-through decoration-[#00CCFF]/60 decoration-2',
                                  )}
                                >
                                  {item}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
                <Card className="border-white/10 bg-[#10111a]/96 text-white shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-2xl">Progreso del checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progressValue} className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-[#00CCFF] [&>div]:to-[#9933FF]" />
                    <p className="text-sm text-gray-300">
                      {completedCount} de {TOTAL_ITEMS} ítems completados
                    </p>
                    <Separator className="bg-white/10" />
                    <p className="text-sm leading-7 text-gray-300">
                      Cada casilla sin marcar es una señal concreta de que tu web todavía tiene margen
                      para vender mejor.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-[#10111a]/96 text-white shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-2xl">Resultado del checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-[#9BE7FF]">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium uppercase tracking-[0.18em]">
                        Puntaje actual: {completedCount}/{TOTAL_ITEMS}
                      </span>
                    </div>
                    <h3 className="font-rajdhani text-2xl font-bold">{result.title}</h3>
                    <p className="text-base leading-7 text-gray-300">{result.description}</p>
                    <Link
                      to={result.href}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-5 py-3 text-sm font-semibold text-white"
                    >
                      {result.cta}
                    </Link>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>

        <section id="formulario" className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">Descarga en PDF</p>
              <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
                Descargá el checklist en PDF
                <br />
                para usarlo cuando quieras.
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-300 sm:text-lg">
                Te lo mandamos por email en segundos. Sin spam. Podés darte de baja cuando quieras.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#10111a]/96 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-8">
              {submitState === 'sent' ? (
                <div className="space-y-5 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <Download className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-rajdhani text-3xl font-bold text-white">
                      ¡Listo! Te mandamos el checklist a {successEmail}.
                    </h3>
                    <p className="text-base leading-7 text-gray-300">
                      Revisá tu bandeja de entrada, y también el spam por las dudas. Si querés, podés
                      descargarlo ahora mismo otra vez.
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href={CHECKLIST_PDF_PATH}
                      download="checklist-web-tuwebai.pdf"
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 text-sm font-semibold text-white"
                    >
                      Descargar el PDF →
                    </a>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubmitState('idle')}
                      className="min-h-11 rounded-full border-white/10 bg-white/5 px-6 text-white hover:bg-white/10"
                    >
                      Enviar a otro email
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDownloadSubmit} className="space-y-6" noValidate>
                  {feedback && (
                    <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {feedback}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="checklist-name" className="text-gray-200">
                      Nombre *
                    </Label>
                    <Input
                      id="checklist-name"
                      value={form.name}
                      onChange={(event) => handleFormChange('name', event.target.value)}
                      placeholder="Tu nombre"
                      autoComplete="name"
                      className="min-h-11 border-white/10 bg-[#12131b] text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checklist-email" className="text-gray-200">
                      Email *
                    </Label>
                    <Input
                      id="checklist-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => handleFormChange('email', event.target.value)}
                      placeholder="tu@email.com"
                      autoComplete="email"
                      className="min-h-11 border-white/10 bg-[#12131b] text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-3 pt-2 text-center">
                    <Button
                      type="submit"
                      disabled={submitState === 'submitting'}
                      className="min-h-11 w-full rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 text-base font-semibold text-white"
                    >
                      {submitState === 'submitting' ? 'Enviando...' : 'Enviarme el checklist →'}
                    </Button>
                    <p className="text-sm text-gray-400">
                      Al suscribirte aceptás recibir contenido de TuWebAI. Podés darte de baja en
                      cualquier momento.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,28,0.92)_0%,rgba(11,11,17,0.96)_100%)] p-8 text-center shadow-[0_30px_70px_rgba(0,0,0,0.28)]">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">CTA final</p>
            <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl">
              ¿Encontraste problemas en el checklist?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-300">
              Podemos resolverlos. Si querés una revisión real de tu caso, seguí con el diagnóstico
              gratuito.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/diagnostico-gratuito"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 text-sm font-semibold text-white"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Pedí tu diagnóstico gratuito →
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-4xl">
            <Accordion type="single" collapsible className="rounded-[24px] border border-white/10 bg-[#10111a]/96 px-4 py-2">
              <AccordionItem value="uso-pdf" className="border-white/10">
                <AccordionTrigger className="text-left font-rajdhani text-xl font-bold text-white hover:no-underline">
                  Qué pasa después de descargarlo
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-base leading-7 text-gray-300">
                  <p>
                    El PDF te sirve para revisar tu sitio con calma o compartirlo con tu equipo.
                    El checklist interactivo queda en esta misma página para usarlo online gratis.
                  </p>
                  <p>
                    Si al terminar detectás varios puntos flojos, podés pasar directo a{' '}
                    <Link to="/diagnostico-gratuito" className="text-[#9BE7FF] underline underline-offset-4">
                      /diagnostico-gratuito
                    </Link>{' '}
                    y lo revisamos con vos.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
    </>
  );
}
