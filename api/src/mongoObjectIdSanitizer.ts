import { ObjectId } from 'mongodb';

/**
 * Attempts to convert a string to an ObjectId.
 * @param value The string to convert.
 * @returns The ObjectId, or null if the string is not a valid ObjectId.
 */
export default function mongoObjectIdSanitizer(value: string): ObjectId | null {
  if (!ObjectId.isValid(value)) {
    return null;
  }

  return new ObjectId(value);
}
