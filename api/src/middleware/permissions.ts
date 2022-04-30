import { NextFunction, Request, Response } from 'express';
import {
  UserRepository,
  UserRole,
  USER_ROLE_PRIORITIES
} from '../models/userRepo';

/**
 * A middleware that requires a certain type of User before executing the route.
 * @param role The role that the user must have to access the route
 * @returns Middleware function
 */
export default function permissions(role: UserRole) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session;

    if (!userId) {
      return res.error(401, { message: 'Unauthorized' });
    }

    const { findUnique } = await UserRepository(req);

    const user = await findUnique(userId);
    if (!user) {
      return res.error(401, { message: 'Unauthorized' });
    }

    if (USER_ROLE_PRIORITIES[user.role] < USER_ROLE_PRIORITIES[role]) {
      return res.error(403, { message: 'Forbidden' });
    }

    next();
  };
}

declare global {
  namespace Express {
    export interface Request {
      /**
       * The session user id, not part of the express sessions API.
       */
      userId?: string;
    }
  }
}
