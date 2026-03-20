export type FirebaseAuthActionMode = 'resetPassword' | 'verifyEmail' | 'recoverEmail';

export type ResolvedAuthAction =
  | {
    kind: 'firebase';
    mode: FirebaseAuthActionMode;
    code: string;
  }
  | {
    kind: 'legacy-verify';
    token: string;
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
