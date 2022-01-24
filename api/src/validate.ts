import { Response } from 'express';

export function findMissingKeys<T>(
  body: Record<string, string>,
  requiredFields: Array<keyof T>
): FindMissingResult<T> | undefined {
  const missing = requiredFields.filter((field) => !body.hasOwnProperty(field));

  if (missing.length === 0) {
    return undefined;
  }

  return {
    keys: missing,
    resolve(res) {
      if (this.keys.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${this.keys.join(', ')}`
        });
      }
    }
  };
}

export interface OkResult<T = unknown> {
  data: T;
}

export interface ErrorResult<T = unknown> {
  error: {
    message?: string;
    code?: string;
    data?: T;
  };
}

export type PartialResult<D = unknown, E = unknown> = OkResult<D> &
  ErrorResult<E>;

export interface FindMissingResult<T> {
  keys: Array<keyof T>;
  resolve(res: Response): Response | undefined;
}
