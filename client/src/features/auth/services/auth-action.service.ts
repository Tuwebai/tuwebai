import { applyActionCode, checkActionCode, verifyPasswordResetCode } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import type { PreparedAuthAction, ResolvedAuthAction } from '@/features/auth/types/auth-action';

interface ResolveAuthActionInput {
  searchParams: URLSearchParams;
  token?: string;
}

interface FirebaseActionData {
  email?: string;
  previousEmail?: string;
}

const getActionEmail = (data: FirebaseActionData): string | null => data.email ?? data.previousEmail ?? null;

export const resolveAuthAction = ({ searchParams, token }: ResolveAuthActionInput): ResolvedAuthAction => {
  const mode = searchParams.get('mode');
  const code = searchParams.get('oobCode');

  if (mode && code) {
    if (mode === 'resetPassword' || mode === 'verifyEmail' || mode === 'recoverEmail') {
      return { kind: 'firebase', mode, code };
    }

    return { kind: 'invalid', reason: 'La acción solicitada no está soportada.' };
  }

  if (token) {
    return { kind: 'legacy-verify', token };
  }

  return { kind: 'invalid', reason: 'El enlace no contiene un código de acción válido.' };
};

export const prepareAuthAction = async (action: Extract<ResolvedAuthAction, { kind: 'firebase' }>): Promise<PreparedAuthAction> => {
  if (action.mode === 'resetPassword') {
    const email = await verifyPasswordResetCode(auth, action.code);
    return {
      mode: 'resetPassword',
      email,
    };
  }

  const info = await checkActionCode(auth, action.code);
  const email = getActionEmail(info.data as FirebaseActionData);

  return {
    mode: action.mode,
    email,
  };
};

export const applyPreparedAuthAction = async (action: Extract<ResolvedAuthAction, { kind: 'firebase' }>) => {
  if (action.mode === 'verifyEmail' || action.mode === 'recoverEmail') {
    await applyActionCode(auth, action.code);
  }
};
