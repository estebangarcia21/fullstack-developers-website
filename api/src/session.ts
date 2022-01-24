import { ObjectId } from 'mongodb';
import { AnyRequest } from './models';

export const SESSION_COOKIE_NAME = 'X-FranklinFullstackDevelopers-Session';

export function bindSession(req: AnyRequest, id: string | ObjectId) {
  if (typeof id === 'string') {
    req.session.userId = id;
  } else {
    req.session.userId = id.toHexString();
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
