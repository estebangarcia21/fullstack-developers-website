import { ObjectId } from 'mongodb';
import { AnyRequest } from '.';

export interface ResetPasswordTokensDocument {
  _id: ObjectId;
  createdAt: Date;
  email: string;
  token: string;
}

export class ResetPasswordTokens {
  static async findUnique(
    req: AnyRequest,
    email: string
  ): Promise<ResetPasswordTokensDocument | null> {
    const col = await req.getMongoCollection(
      'website',
      'reset_password_tokens'
    );

    return col.findOne<ResetPasswordTokensDocument>({ email });
  }

  static async verifyToken(
    req: AnyRequest,
    email: string,
    token: string
  ): Promise<boolean> {
    const col = await req.getMongoCollection(
      'website',
      'reset_password_tokens'
    );

    const existingToken = await col.findOne<ResetPasswordTokensDocument>({
      email,
      token
    });

    return !!existingToken;
  }

  /**
   * Creates a token for a user
   * @param userId The user id
   */
  static async create(req: AnyRequest, email: string) {
    const { randomBytes } = await import('crypto');

    const col = await req.getMongoCollection(
      'website',
      'reset_password_tokens'
    );

    const token = randomBytes(32).toString('hex');

    const existingToken = await col.findOne<ResetPasswordTokensDocument>({
      email
    });

    const docId = existingToken?._id ?? new ObjectId();

    await col.updateOne(
      { _id: docId },
      {
        $set: {
          _id: docId,
          createdAt: new Date(),
          email,
          token
        } as ResetPasswordTokensDocument
      },
      { upsert: true }
    );
  }

  static async delete(req: AnyRequest, email: string) {
    const col = await req.getMongoCollection(
      'website',
      'reset_password_tokens'
    );

    await col.deleteOne({ email });
  }
}
