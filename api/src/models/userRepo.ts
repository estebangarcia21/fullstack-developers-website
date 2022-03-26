import argon from 'argon2';
import { ObjectId } from 'mongodb';
import { AnyRequest } from '.';
import { repository, RepositoryRequest } from '../repo';

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

export const userRepository = repository('website', 'users', { password: 0 });

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

type UserAuthenticationResult = 'authenticated' | 'denied' | 'non existing';

interface AuthenticationResult {
  userId?: string;
  result: UserAuthenticationResult;
}

export const UserUtil = {
  async updatePassword(req: UserRequest, email: string, password: string) {
    const user = await req.repository.findOne<UserDocument>({ email }, {});
    if (!user) {
      return { result: 'non existing' };
    }

    const result = await argon.verify(user.password, password);
    if (!result) {
      return { result: 'denied' };
    }

    return { result: 'authenticated', userId: user._id.toHexString() };
  },
  /**
   * Authenticates a user.
   * @param req Request instance to get mongo collection from.
   * @param email The email to find the user with.
   * @param password The password to check against the user's password.
   * @returns The user document if the user exists and the password is correct. Otherwise, returns null.
   */
  async auth(
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
};

export type UserRequest = RepositoryRequest<User, CreateUserInput>;
