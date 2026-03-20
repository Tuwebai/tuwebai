import { useEffect, useState } from 'react';
import { Cookie, Eye, EyeOff, FileText, Info, Loader2, Mail, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Button } from '@/shared/ui/button';
import { Switch } from '@/shared/ui/switch';
import type { UpdateUserPrivacyPayload, UserPrivacySettings } from '../types/privacy';

interface PrivacyTabProps {
  settings: UserPrivacySettings;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (payload: UpdateUserPrivacyPayload) => Promise<void>;
}

export function PrivacyTab({ settings, isLoading, isSaving, onSave }: PrivacyTabProps) {
  const [activeSection, setActiveSection] = useState<'visibility' | 'consent'>('visibility');
  const [draft, setDraft] = useState<UpdateUserPrivacyPayload>({
    marketingConsent: settings.marketingConsent,
    analyticsConsent: settings.analyticsConsent,
    profileEmailVisible: settings.profileEmailVisible,
    profileStatusVisible: settings.profileStatusVisible,
  });

  useEffect(() => {
    setDraft({
      marketingConsent: settings.marketingConsent,
      analyticsConsent: settings.analyticsConsent,
      profileEmailVisible: settings.profileEmailVisible,
      profileStatusVisible: settings.profileStatusVisible,
    });
  }, [
    settings.marketingConsent,
    settings.analyticsConsent,
    settings.profileEmailVisible,
    settings.profileStatusVisible,
  ]);

  const hasChanges =
    draft.marketingConsent !== settings.marketingConsent ||
    draft.analyticsConsent !== settings.analyticsConsent ||
    draft.profileEmailVisible !== settings.profileEmailVisible ||
    draft.profileStatusVisible !== settings.profileStatusVisible;

  const handleSubmit = async () => {
    if (!hasChanges) {
      return;
    }

    await onSave(draft);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-white">
          <Eye className="h-5 w-5" />
          Privacidad
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-300">
          Gestiona cómo se muestran tus datos en el panel y registra tus decisiones de privacidad desde un solo lugar.
        </p>
      </div>

      <div className="grid gap-5 min-[1440px]:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
          <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Centro de privacidad</p>
            <h3 className="mt-2 text-lg font-semibold leading-tight text-white">Configura la visibilidad y los consentimientos de tu cuenta.</h3>
          </div>

          <Accordion type="single" collapsible defaultValue="controls" className="space-y-2">
            <AccordionItem value="controls" className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium text-white hover:no-underline">
                <span className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-cyan-300" />
                  Controles de cuenta
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2">
                <nav className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection('visibility')}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                      activeSection === 'visibility'
                        ? 'bg-cyan-500/15 text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Eye className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">Visibilidad</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">Controla qué datos aparecen en tu resumen.</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('consent')}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                      activeSection === 'consent'
                        ? 'bg-cyan-500/15 text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">Consentimientos</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">Administra tus autorizaciones registradas.</span>
                    </span>
                  </button>
                </nav>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal" className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium text-white hover:no-underline">
                <span className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-cyan-300" />
                  Textos legales
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2">
                <div className="space-y-2">
                  <a
                    href="/politica-privacidad"
                    className="flex items-start gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">Política de privacidad</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">Consulta el detalle de tratamiento y control de datos.</span>
                    </span>
                  </a>
                  <a
                    href="/politica-cookies"
                    className="flex items-start gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">Política de cookies</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">Revisa cómo tratamos preferencias y medición del sitio.</span>
                    </span>
                  </a>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          {activeSection === 'visibility' && (
            <div className="space-y-5">
            <div>
              <h3 className="text-lg font-medium text-white">Visibilidad del resumen</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Decide qué información aparece en la parte superior de tu panel.
              </p>
            </div>

            <div className={`space-y-4 ${isLoading ? 'pointer-events-none opacity-70' : ''}`}>
              <div className="flex min-h-[72px] items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Mail className="h-4 w-4 text-cyan-300" />
                    Mostrar email en el encabezado
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Si lo apagas, tu email deja de mostrarse en el resumen principal del panel.
                  </p>
                </div>
                <Switch
                  checked={Boolean(draft.profileEmailVisible)}
                  onCheckedChange={(checked) => setDraft((current) => ({ ...current, profileEmailVisible: checked }))}
                  aria-label="Mostrar email en el encabezado"
                />
              </div>

              <div className="flex min-h-[72px] items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Shield className="h-4 w-4 text-cyan-300" />
                    Mostrar estado de cuenta
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Controla si el badge de estado de tu cuenta aparece junto a tu nombre.
                  </p>
                </div>
                <Switch
                  checked={Boolean(draft.profileStatusVisible)}
                  onCheckedChange={(checked) => setDraft((current) => ({ ...current, profileStatusVisible: checked }))}
                  aria-label="Mostrar estado de cuenta"
                />
              </div>
            </div>
            </div>
          )}

          {activeSection === 'consent' && (
            <div className="space-y-5">
            <div>
              <h3 className="text-lg font-medium text-white">Consentimientos</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Revisa y actualiza las autorizaciones que quedan asociadas a tu cuenta.
              </p>
            </div>

            <div className={`space-y-4 ${isLoading ? 'pointer-events-none opacity-70' : ''}`}>
              <div className="flex min-h-[72px] items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Mail className="h-4 w-4 text-cyan-300" />
                    Permitir contacto comercial
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Autoriza a TuWeb.ai a registrarte para futuras comunicaciones comerciales relacionadas con servicios y novedades.
                  </p>
                </div>
                <Switch
                  checked={Boolean(draft.marketingConsent)}
                  onCheckedChange={(checked) => setDraft((current) => ({ ...current, marketingConsent: checked }))}
                  aria-label="Permitir contacto comercial"
                />
              </div>

              <div className="flex min-h-[72px] items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Info className="h-4 w-4 text-cyan-300" />
                    Permitir analítica funcional
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Controla si TuWeb.ai puede medir uso básico del sitio para mejorar rendimiento y experiencia.
                  </p>
                </div>
                <Switch
                  checked={Boolean(draft.analyticsConsent)}
                  onCheckedChange={(checked) => setDraft((current) => ({ ...current, analyticsConsent: checked }))}
                  aria-label="Permitir analítica funcional"
                />
              </div>
            </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-sm leading-6 text-slate-400">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              <span>Los cambios se reflejan en tu panel apenas los guardas.</span>
            </div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isSaving || !hasChanges}
            className="min-h-[44px] min-w-[168px] rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Guardar cambios de privacidad
              </>
            )}
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
