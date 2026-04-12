import { useState } from 'react';
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import WhatsAppButton from '@/shared/ui/whatsapp-button';
import MetaTags from '@/shared/ui/meta-tags';
import {
  TUWEBAI_SITE_FULL_URL,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';
import { getProposalErrorMessage, submitProposal } from '@/features/proposals/services/proposals.service';
import {
  trackProposalError,
  trackProposalStepCompleted,
  trackProposalSubmitted,
} from '@/features/proposals/services/proposal-analytics.service';
import {
  formSchema,
  type FormValues,
  STEP_FIELDS,
  TOTAL_STEPS,
} from './proposal-request-form.config';
import {
  AlternativeContactSection,
  Step1Identidad,
  Step2Proyecto,
  Step3Contexto,
  StepIndicator,
  SuccessScreen,
} from './proposal-request-form-sections';

const defaultValues: DefaultValues<FormValues> = {
  nombre: '',
  email: '',
  descripcion: '',
  presupuesto_rango: undefined,
  plazo: undefined,
  como_nos_encontraste: undefined,
};

const getWhatsappHref = (name: string) => {
  const message = name.trim()
    ? `Hola, soy ${name.trim()} y acabo de enviar una consulta desde TuWebAI.`
    : 'Hola, acabo de enviar una consulta desde TuWebAI.';

  return `${TUWEBAI_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
};

const renderStep = (currentStep: number) => {
  if (currentStep === 1) {
    return <Step1Identidad />;
  }

  if (currentStep === 2) {
    return <Step2Proyecto />;
  }

  return <Step3Contexto />;
};

export default function ProposalRequestPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappHref = getWhatsappHref(form.watch('nombre') ?? '');

  const handleNextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep] ?? [];
    const isStepValid = fieldsToValidate.length === 0 ? true : await form.trigger(fieldsToValidate);

    if (!isStepValid || currentStep >= TOTAL_STEPS) {
      return;
    }

    trackProposalStepCompleted(currentStep);
    setCurrentStep((previousStep) => previousStep + 1);
  };

  const handlePreviousStep = () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError(null);
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 1));
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (data.email) {
        localStorage.setItem('userEmail', data.email);
      }

      await submitProposal({
        nombre: data.nombre,
        email: data.email,
        pais: data.pais,
        tipo_proyecto: data.tipo_proyecto,
        presupuesto: data.presupuesto_rango ?? 'no-especificado',
        plazo: data.plazo ?? 'no-especificado',
        detalles: data.descripcion,
        como_nos_encontraste: data.como_nos_encontraste,
      });

      trackProposalSubmitted(data.tipo_proyecto);
      setSubmitted(true);
      setCurrentStep(1);
      form.reset(defaultValues);
    } catch (error) {
      const message = getProposalErrorMessage(
        error,
        'No pudimos enviar tu consulta en este momento. Probá de nuevo en unos minutos.',
      );

      trackProposalError(message);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <MetaTags
        title="Consulta y propuesta inicial"
        description="Contanos qué necesita tu negocio y te respondemos con un diagnóstico claro. Consulta inicial sin cargo para webs, e-commerce y sistemas a medida."
        keywords="consulta desarrollo web, propuesta web, diagnóstico gratuito, proyecto web Argentina, TuWebAI"
        url={`${TUWEBAI_SITE_FULL_URL}/consulta`}
        ogType="website"
      />

      <div className="min-h-screen bg-[var(--bg-base)] bg-[image:var(--gradient-page-shell)] text-[var(--text-primary)]">
        <WhatsAppButton />

        <header className="px-4 pb-10 pt-24 sm:pb-14">
          <div className="mx-auto max-w-3xl text-center">
            <Link className="inline-block bg-[image:var(--gradient-brand)] bg-clip-text text-3xl font-bold text-transparent" to="/">
              TuWebAI
            </Link>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Contanos tu proyecto
            </h1>
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
              Completá estos tres pasos y te respondemos con una propuesta clara, simple y alineada a tu negocio.
            </p>
          </div>
        </header>

        <section className="px-4 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-[var(--radius-2xl)] border border-[var(--signal-border)] bg-[var(--gradient-subtle)] p-[1px] shadow-[var(--shadow-elevated)]">
              <div className="rounded-[calc(var(--radius-2xl)-1px)] bg-[var(--bg-surface)] p-5 sm:p-8">
                {submitted ? (
                  <SuccessScreen whatsappHref={whatsappHref} />
                ) : (
                  <FormProvider {...form}>
                    <StepIndicator currentStep={currentStep} />

                    {submitError ? (
                      <div className="mb-6 rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-dim)] px-4 py-3 text-sm text-[var(--text-primary)]">
                        {submitError}
                      </div>
                    ) : null}

                    <form className="space-y-8" onSubmit={onSubmit}>
                      {renderStep(currentStep)}

                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                        {currentStep > 1 ? (
                          <Button
                            className="w-full rounded-full border border-[var(--border-default)] bg-transparent px-6 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] sm:w-auto"
                            disabled={isSubmitting}
                            onClick={handlePreviousStep}
                            type="button"
                            variant="ghost"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
                            Anterior
                          </Button>
                        ) : (
                          <div />
                        )}

                        {currentStep < TOTAL_STEPS ? (
                          <Button
                            className="w-full rounded-full bg-[image:var(--gradient-brand)] px-6 font-semibold text-white hover:opacity-95 sm:w-auto"
                            disabled={isSubmitting}
                            onClick={handleNextStep}
                            type="button"
                          >
                            Siguiente
                            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                          </Button>
                        ) : (
                          <Button
                            className="w-full rounded-full bg-[image:var(--gradient-brand)] px-6 font-semibold text-white hover:opacity-95 sm:w-auto"
                            disabled={isSubmitting}
                            type="submit"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.5} />
                                Enviando...
                              </>
                            ) : (
                              <>
                                Enviar propuesta
                                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </FormProvider>
                )}

                <AlternativeContactSection />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
