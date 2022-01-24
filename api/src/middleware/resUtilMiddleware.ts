import { NextFunction, Request, Response } from 'express';
import { ErrorResult, OkResult, PartialResult } from '../validate';

function data<T>(this: Response, data?: T) {
  return this.json({ data } as OkResult<T>);
}

function partial(
  this: Response,
  statusCode: number,
  partialResult: PartialResult
) {
  return this.status(statusCode).json(partialResult);
}

function error(
  this: Response,
  statusCode: number,
  error: ErrorResult['error']
) {
  return this.status(statusCode).json({ data: null, error });
}

export function resUtilMiddleware(
  _: Request,
  res: Response,
  next: NextFunction
) {
  res.data = data;
  res.error = error;
  res.partial = partial;

  next();
}

declare global {
  namespace Express {
    export interface Response {
      data: typeof data;
      error: typeof error;
      partial: typeof partial;
    }
  }
}
