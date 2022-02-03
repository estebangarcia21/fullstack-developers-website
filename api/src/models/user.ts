import { FindOptions, InsertOneResult, ObjectId } from 'mongodb';
import { AnyRequest } from '.';
import mongoObjectIdSanitizer from '../mongoObjectIdSanitizer';
import argon from 'argon2';

export const USER_ROLE_PRIORITIES: { [role in UserRole]: number } = {
  admin: 1,
  member: 0
};

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type UserRole = 'admin' | 'member';

export type User = Pick<
  UserDocument,
  '_id' | 'firstName' | 'lastName' | 'role'
>;

interface UserDocument {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  /**
   * The role of the user.
   * @default member
   * @example
   * - admin
   * - member
   */
  role: UserRole;
}

const MONGO_USER_OPTS: FindOptions<UserDocument> = {
  projection: { _id: 1 }
};

interface AuthenticationResult {
  userId?: string;
  result: UserAuthenticationResult;
}

type UserAuthenticationResult = 'authenticated' | 'denied' | 'non existing';

export class UserRepository {
  static async findUnique(req: AnyRequest, id: string): Promise<User | null> {
    const col = await req.getMongoCollection('website', 'users');

    const sanitizedId = mongoObjectIdSanitizer(id);
    if (!sanitizedId) {
      return null;
    }

    return await col.findOne<User>({ _id: sanitizedId }, MONGO_USER_OPTS);
  }

  static async updatePassword(
    req: AnyRequest,
    email: string,
    newPassword: string
  ) {
    const col = await req.getMongoCollection('website', 'users');

    const passwordHash = await argon.hash(newPassword);

    return await col.updateOne({ email }, { $set: { password: passwordHash } });
  }

  /**
   * Creates a new user.
   *
   * @param req Request instance to get mongo collection from.
   * @param input The input to create the user with.
   * @returns The inserted user document. If the user already exists, returns null.
   */
  static async create(
    req: AnyRequest,
    { email, firstName, lastName, password }: CreateUserInput
  ): Promise<InsertOneResult<Document> | null> {
    const col = await req.getMongoCollection('website', 'users');

    const user = await col.findOne<UserDocument>({ email });
    if (user) {
      return null;
    }

    const passwordHash = await argon.hash(password);

    const newUser: Partial<UserDocument> = {
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: 'member'
    };

    return await col.insertOne(newUser);
  }

  static async updateOne(
    req: AnyRequest,
    email: string,
    update: Partial<UserDocument>
  ) {
    const col = await req.getMongoCollection('website', 'users');

    return await col.updateOne({ email }, { $set: update });
  }

  /**
   * Authenticates a user.
   * @param req Request instance to get mongo collection from.
   * @param email The email to find the user with.
   * @param password The password to check against the user's password.
   * @returns The user document if the user exists and the password is correct. Otherwise, returns null.
   */
  static async auth(
    req: AnyRequest,
    email: string,
    password: string
  ): Promise<AuthenticationResult> {
    if (req.session.userId) {
      return { result: 'authenticated' };
    }

    const col = await req.getMongoCollection('website', 'users');

    const user = await col.findOne<Pick<UserDocument, '_id' | 'password'>>(
      { email },
      { projection: { _id: 1, password: 1 } }
    );
    if (!user) {
      return { result: 'non existing' };
    }

    const { password: passwordHash } = user;

    const authResult = await argon.verify(passwordHash, password);
    if (!authResult) {
      return { result: 'denied' };
    }

    return { result: 'authenticated', userId: user._id.toHexString() };
  }
}
