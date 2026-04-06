import type { Response } from 'express';
import { sendError } from '../../../core/contracts/api-response';
import { getUsersService } from '../application/users.service';

export const USERS_REPOSITORY_UNAVAILABLE_MESSAGE = 'Persistencia de usuarios no disponible';

export const usersService = getUsersService();

export const ensureUsersServiceAvailable = (res: Response): boolean => {
  if (usersService.isAvailable()) {
    return true;
  }

  sendError(res, 503, USERS_REPOSITORY_UNAVAILABLE_MESSAGE);
  return false;
};
