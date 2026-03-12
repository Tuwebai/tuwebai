import { useEffect, useState } from 'react';
import { Eye, EyeOff, Info, Loader2, Mail, Shield } from 'lucide-react';
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
  const [draft, setDraft] = useState<UpdateUserPrivacyPayload>({
    profileEmailVisible: settings.profileEmailVisible,
    profileStatusVisible: settings.profileStatusVisible,
  });

  useEffect(() => {
    setDraft({
      profileEmailVisible: settings.profileEmailVisible,
      profileStatusVisible: settings.profileStatusVisible,
    });
  }, [settings.profileEmailVisible, settings.profileStatusVisible]);

  const hasChanges =
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

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5">
          <h3 className="text-lg font-medium text-white">Visibilidad del resumen</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Estos controles gobiernan solo el encabezado de tu panel para mantener una experiencia clara y consistente.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex min-h-[64px] items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-4">
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

          <div className="flex min-h-[64px] items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-4">
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
                Guardar visibilidad
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
