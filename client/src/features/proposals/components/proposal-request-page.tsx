import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import WhatsAppButton from '@/shared/ui/whatsapp-button';
import MetaTags from '@/shared/ui/meta-tags';
import { TUWEBAI_SITE_FULL_URL, TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';
import { getProposalErrorMessage, submitProposal } from '@/features/proposals/services/proposals.service';
import {
  trackProposalError,
  trackProposalStepCompleted,
  trackProposalSubmitted,
} from '@/features/proposals/services/proposal-analytics.service';
import { SuccessScreen, AlternativeContactSection } from './proposal-request-form-feedback';
import { defaultValues, formSchema, STEP_FIELDS, TOTAL_STEPS, type FormValues } from './proposal-request-form.config';
import { StepIndicator } from './proposal-request-form-primitives';
import { Step1Identidad } from './proposal-request-step-identity';
import { Step2Proyecto, Step3Contexto } from './proposal-request-step-details';

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
          <div className="mx-auto max-w-6xl">
            <Link className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white" to="/">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.14),transparent_32%),linear-gradient(180deg,rgba(18,18,23,0.98),rgba(10,10,15,0.98))] px-5 py-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] sm:px-6 md:rounded-[32px] md:px-10 md:py-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
                  Consulta TuWebAI
                </span>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gray-300">
                  Propuesta inicial sin cargo
                </span>
              </div>
              <h1 className="mt-6 max-w-4xl font-rajdhani text-[2.35rem] font-bold leading-[1.02] text-white sm:text-5xl md:text-6xl">
                Contanos tu proyecto y te respondemos con un plan claro.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300 md:text-lg">
                Completá estos tres pasos y te devolvemos una propuesta simple, priorizada y alineada a tu negocio.
              </p>
            </div>
          </div>
        </header>

        <section className="px-4 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.1),transparent_38%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.08),transparent_34%),linear-gradient(180deg,rgba(18,18,23,0.98),rgba(10,10,15,0.98))] p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] sm:p-8 md:rounded-[32px]">
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
                          className="w-full rounded-full border border-white/10 bg-white/5 px-6 text-[var(--text-primary)] hover:bg-white/10 sm:w-auto"
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
        </section>
      </div>
    </>
  );
}
