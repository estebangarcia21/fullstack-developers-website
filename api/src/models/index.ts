import { Request } from 'express';

export type AnyRequest =
  | Request<any, any, any, Record<string, any> | undefined, Record<string, any>>
  | Request;
