export type SupabaseAuthActionMode = 'resetPassword' | 'verifyEmail' | 'recoverEmail';

export type ResolvedAuthAction =
  | {
    kind: 'supabase';
    mode: SupabaseAuthActionMode;
    tokenHash: string;
  }
  | {
    kind: 'invalid';
    reason: string;
  };

export type PreparedAuthAction =
  | {
    mode: 'resetPassword';
    email: string;
  }
  | {
    mode: 'verifyEmail' | 'recoverEmail';
    email: string | null;
  };
