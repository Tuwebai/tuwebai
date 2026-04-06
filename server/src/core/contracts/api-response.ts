import type { Response } from 'express';

export interface ApiSuccessResponse<T = undefined> {
  data: T;
  success: true;
}

export interface ApiErrorResponse {
  details?: string;
  message: string;
  success: false;
}

export type ApiResponse<T = undefined> = ApiSuccessResponse<T> | ApiErrorResponse;

export const sendSuccess = <T>(res: Response, data: T, status = 200) =>
  res.status(status).json({
    success: true,
    data,
  } satisfies ApiSuccessResponse<T>);

export const sendSuccessWithoutData = (res: Response, status = 200) =>
  res.status(status).json({
    success: true,
  });

export const sendError = (
  res: Response,
  status: number,
  message: string,
  details?: string,
) =>
  res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  } satisfies ApiErrorResponse);
