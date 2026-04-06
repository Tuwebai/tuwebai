import type { Request, Response } from 'express';
import { sendError, sendSuccess } from '../../../core/contracts/api-response';
import { getUserAvatar, uploadUserAvatar } from '../../../infrastructure/storage/avatar-storage.service';
import { getErrorMessage } from '../../../shared/utils/error-message';
import { appLogger } from '../../../utils/app-logger';
import type { UserDocument } from '../domain/users.repository';
import { ensureUsersServiceAvailable, usersService } from './shared';

const GOOGLE_AVATAR_TIMEOUT_MS = 8000;

const isAllowedAvatarHost = (host: string) =>
  host === 'lh3.googleusercontent.com' ||
  host.endsWith('.googleusercontent.com') ||
  host.endsWith('.ggpht.com');

export const handleAvatarProxy = async (req: Request, res: Response) => {
  const src = typeof req.query.src === 'string' ? req.query.src.trim() : '';

  if (!src) {
    return sendError(res, 400, 'src requerido');
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return sendError(res, 400, 'src invalido');
  }

  if (url.protocol !== 'https:' || !isAllowedAvatarHost(url.hostname)) {
    return sendError(res, 400, 'src no permitido');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GOOGLE_AVATAR_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'User-Agent': 'TuWeb.ai Avatar Proxy/1.0',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      appLogger.warn('users.avatar_proxy_upstream_failed', {
        status: response.status,
        host: url.hostname,
      });
      return sendError(res, 502, 'No se pudo obtener el avatar remoto');
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const cacheControl = response.headers.get('cache-control');
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', cacheControl || 'public, max-age=3600, s-maxage=3600');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.send(buffer);
  } catch (error: unknown) {
    appLogger.warn('users.avatar_proxy_failed', {
      error: getErrorMessage(error, 'unknown_avatar_proxy_error'),
      host: url.hostname,
    });
    return sendError(res, 502, 'No se pudo obtener el avatar remoto');
  } finally {
    clearTimeout(timeout);
  }
};

export const handleGetStoredAvatar = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const avatar = await getUserAvatar(uid);

    res.setHeader('Content-Type', avatar.contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.send(avatar.buffer);
  } catch (error: unknown) {
    const message = getErrorMessage(error, 'unknown_avatar_read_error');
    if (message === 'avatar_not_found') {
      return sendError(res, 404, 'Avatar no encontrado');
    }

    appLogger.warn('users.avatar_read_failed', {
      uid: req.params?.uid,
      error: message,
    });
    return sendError(res, 502, 'No se pudo obtener el avatar');
  }
};

export const handleUploadUserAvatar = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const { uid } = req.params;
    const dataUrl = String(req.body?.dataUrl || '');
    const imageUrl = await uploadUserAvatar(uid, dataUrl);

    await usersService.upsertUserByUid(uid, {
      image: imageUrl,
    } satisfies Partial<UserDocument>);

    return sendSuccess(res, { image: imageUrl });
  } catch (error: unknown) {
    const message = getErrorMessage(error, 'unknown_upload_avatar_error');
    appLogger.warn('users.avatar_upload_failed', {
      uid: req.params?.uid,
      error: message,
    });

    if (
      message === 'avatar_invalid_data_url' ||
      message === 'avatar_invalid_mime_type' ||
      message === 'avatar_invalid_size'
    ) {
      return sendError(res, 400, 'La imagen no cumple con el formato permitido.');
    }

    return sendError(res, 500, 'No se pudo subir la imagen de perfil.');
  }
};
