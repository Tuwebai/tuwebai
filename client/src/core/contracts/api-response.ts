export interface ApiSuccessResponse<T = undefined> {
  data: T;
  requestId?: string;
  success: true;
}

export interface ApiErrorResponse {
  details?: string;
  message: string;
  requestId?: string;
  success: false;
}

export type ApiResponse<T = undefined> = ApiSuccessResponse<T> | ApiErrorResponse;

export const isApiSuccessResponse = <T>(value: unknown): value is ApiSuccessResponse<T> =>
  typeof value === 'object' &&
  value !== null &&
  (value as Record<string, unknown>).success === true &&
  'data' in (value as Record<string, unknown>);

export const isApiErrorResponse = (value: unknown): value is ApiErrorResponse =>
  typeof value === 'object' &&
  value !== null &&
  (value as Record<string, unknown>).success === false &&
  typeof (value as Record<string, unknown>).message === 'string';
