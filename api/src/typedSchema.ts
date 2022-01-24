import { checkSchema, ParamSchema, Schema } from 'express-validator';

type TypedSchema<T> = Partial<Record<keyof T, ParamSchema>>;

export function checkTypedSchema<T>(
  schema: TypedSchema<T>,
  defaultLocations?: Parameters<typeof checkSchema>[1]
): ReturnType<typeof checkSchema> {
  return checkSchema(schema as Schema, defaultLocations);
}
