import { useEffect, useState } from 'react';
import { Eye, EyeOff, Info, Loader2, Mail, Shield } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Switch } from '@/shared/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
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
          Controla que datos visibles se muestran en el resumen superior de tu panel. Los cambios se guardan en tu cuenta y se aplican sin tocar el contrato legacy de preferencias.
        </p>
      </div>

      <Tabs
        value={activeSection}
        onValueChange={(value) => setActiveSection(value as 'visibility' | 'consent')}
        className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]"
      >
        <aside className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
          <div className="mb-4 px-2 pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Secciones</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Abre una sola vista a la vez para trabajar privacidad sin ruido visual.
            </p>
          </div>

          <TabsList className="flex h-auto w-full flex-col gap-2 bg-transparent p-0">
            <TabsTrigger
              value="visibility"
              className="w-full justify-start rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-slate-300 data-[state=active]:border-cyan-400/40 data-[state=active]:bg-cyan-500/15 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <span className="flex items-start gap-3">
                <Eye className="mt-0.5 h-4 w-4 text-cyan-300" />
                <span className="space-y-1">
                  <span className="block text-sm font-medium">Visibilidad</span>
                  <span className="block text-xs leading-5 text-slate-400">Controla email y estado del encabezado.</span>
                </span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="consent"
              className="w-full justify-start rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-slate-300 data-[state=active]:border-cyan-400/40 data-[state=active]:bg-cyan-500/15 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <span className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-cyan-300" />
                <span className="space-y-1">
                  <span className="block text-sm font-medium">Consentimientos</span>
                  <span className="block text-xs leading-5 text-slate-400">Registra decisiones comerciales y analiticas.</span>
                </span>
              </span>
            </TabsTrigger>
          </TabsList>
        </aside>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <TabsContent value="visibility" className="mt-0 space-y-5">
            <div>
              <h3 className="text-lg font-medium text-white">Visibilidad del resumen</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Estos controles gobiernan solo el encabezado de tu panel para mantener una experiencia clara y consistente.
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
          </TabsContent>

          <TabsContent value="consent" className="mt-0 space-y-5">
            <div>
              <h3 className="text-lg font-medium text-white">Consentimientos</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Estos consentimientos quedan registrados en tu cuenta y alinean el panel con nuestras politicas de privacidad y cookies. Todavia no activan automatizaciones fuera del panel.
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
                    Permitir analitica funcional
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Registra tu consentimiento para medicion y mejora del servicio cuando la analitica vuelva a estar activa en el producto.
                  </p>
                </div>
                <Switch
                  checked={Boolean(draft.analyticsConsent)}
                  onCheckedChange={(checked) => setDraft((current) => ({ ...current, analyticsConsent: checked }))}
                  aria-label="Permitir analitica funcional"
                />
              </div>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-4 text-sm leading-6 text-cyan-100">
              <p>
                Puedes revisar el detalle legal en{' '}
                <a href="/politica-privacidad" className="font-medium text-cyan-300 hover:text-cyan-200">
                  Politica de Privacidad
                </a>{' '}
                y{' '}
                <a href="/politica-cookies" className="font-medium text-cyan-300 hover:text-cyan-200">
                  Politica de Cookies
                </a>.
              </p>
            </div>
          </TabsContent>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-sm leading-6 text-slate-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
            <span>La previsualizacion real la ves en el encabezado superior apenas guardas los cambios.</span>
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
      </Tabs>
    </div>
  );
}
