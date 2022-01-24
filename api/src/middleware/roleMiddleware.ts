import { NextFunction, Request, Response } from 'express';
import { UserRepository, UserRole, USER_ROLE_PRIORITIES } from '../models/user';

export default function roleMiddleware(role: UserRole) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session;

    if (!userId) {
      return res.error(401, { message: 'Unauthorized' });
    }

    const user = await UserRepository.findUnique(req, userId);
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
      userId?: string;
    }
  }
}
