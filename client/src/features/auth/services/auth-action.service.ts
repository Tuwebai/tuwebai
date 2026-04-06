import {
  verifyAuthPasswordResetCode,
  verifyAuthTokenHash,
} from '@/core/auth/auth-client';
import type { PreparedAuthAction, ResolvedAuthAction } from '@/features/auth/types/auth-action';

interface ResolveAuthActionInput {
  searchParams: URLSearchParams;
  token?: string;
}

interface SupabaseActionData {
  email?: string;
  previousEmail?: string;
}

const getActionEmail = (data: SupabaseActionData): string | null => data.email ?? data.previousEmail ?? null;

export const resolveAuthAction = ({ searchParams, token }: ResolveAuthActionInput): ResolvedAuthAction => {
  const type = searchParams.get('type');
  const tokenHash = searchParams.get('token_hash');

  if (type && tokenHash) {
    if (type === 'recovery') {
      return { kind: 'supabase', mode: 'resetPassword', tokenHash };
    }

    if (type === 'signup' || type === 'email') {
      return { kind: 'supabase', mode: 'verifyEmail', tokenHash };
    }

    if (type === 'email_change') {
      return { kind: 'supabase', mode: 'recoverEmail', tokenHash };
    }

    return { kind: 'invalid', reason: 'La acción solicitada no está soportada.' };
  }

  if (token) {
    return { kind: 'legacy-verify', token };
  }

  return { kind: 'invalid', reason: 'El enlace no contiene un código de acción válido.' };
};

export const prepareAuthAction = async (action: Extract<ResolvedAuthAction, { kind: 'supabase' }>): Promise<PreparedAuthAction> => {
  if (action.mode === 'resetPassword') {
    const result = await verifyAuthTokenHash(action.tokenHash, 'recovery');
    const email = result.user.email ?? (await verifyAuthPasswordResetCode(action.tokenHash));
    return {
      mode: 'resetPassword',
      email,
    };
  }

  const result = await verifyAuthTokenHash(
    action.tokenHash,
    action.mode === 'recoverEmail' ? 'email_change' : 'email',
  );
  const email = getActionEmail({
    email: result.user.email ?? undefined,
  });

  return {
    mode: action.mode,
    email,
  };
};

export const applyPreparedAuthAction = async (_action: Extract<ResolvedAuthAction, { kind: 'supabase' }>) => {};
