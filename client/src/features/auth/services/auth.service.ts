import { backendApi } from '@/lib/backend-api';

export const verifyAuthToken = (token: string) => backendApi.verifyAuthToken(token);

export const verifyAuthDevEmail = (email: string) => backendApi.verifyAuthDevEmail(email);

export const recordPasswordReset = (payload: { email: string; passwordChangedAt: string }) =>
  backendApi.recordPasswordReset(payload);
