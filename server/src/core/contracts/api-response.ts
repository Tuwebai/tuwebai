import type { Response } from 'express';

export interface ApiSuccessResponse<T = undefined> {
  data: T;
  message?: string;
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

const resolveResponseRequestId = (res: Response): string | undefined => {
  const requestId = res.locals?.requestId;
  return typeof requestId === 'string' && requestId.trim().length > 0 ? requestId : undefined;
};

export const sendSuccess = <T>(res: Response, data: T, status = 200) =>
  res.status(status).json({
    success: true,
    data,
    ...(resolveResponseRequestId(res) ? { requestId: resolveResponseRequestId(res) } : {}),
  } satisfies ApiSuccessResponse<T>);

export const sendSuccessWithMessage = <T>(
  res: Response,
  data: T,
  message: string,
  status = 200,
) =>
  res.status(status).json({
    success: true,
    data,
    message,
    ...(resolveResponseRequestId(res) ? { requestId: resolveResponseRequestId(res) } : {}),
  } satisfies ApiSuccessResponse<T>);

export const sendSuccessWithoutData = (res: Response, status = 200) =>
  res.status(status).json({
    success: true,
    ...(resolveResponseRequestId(res) ? { requestId: resolveResponseRequestId(res) } : {}),
  });

export const sendSuccessWithoutDataWithMessage = (res: Response, message: string, status = 200) =>
  res.status(status).json({
    success: true,
    data: undefined,
    message,
    ...(resolveResponseRequestId(res) ? { requestId: resolveResponseRequestId(res) } : {}),
  } satisfies ApiSuccessResponse<undefined>);

export const sendError = (
  res: Response,
  status: number,
  message: string,
  details?: string,
) =>
  res.status(status).json({
    success: false,
    message,
    ...(resolveResponseRequestId(res) ? { requestId: resolveResponseRequestId(res) } : {}),
    ...(details ? { details } : {}),
  } satisfies ApiErrorResponse);
