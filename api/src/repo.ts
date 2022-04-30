import { NextFunction, Request, Response } from 'express';
import { Collection, Document, InsertOneResult, ObjectId } from 'mongodb';
import {
  MongoDbCollectionName,
  MongoDbName
} from './middleware/mongoClientMiddleware';
import { AnyRequest } from './models';
import mongoObjectIdSanitizer from './mongoObjectIdSanitizer';

export type OmitId<T> = Omit<T, '_id'>;
export type Where<T> = Partial<OmitId<T>> | Record<string, unknown>;
export type QueryProjection<U = {}> = Partial<OmitId<U>> &
  Record<string, unknown>;

interface Repository<U, C = OmitId<U>> {
  create(data: C): Promise<InsertOneResult<Document>>;
  findUnique<T = U>(
    id: string | ObjectId,
    projection?: QueryProjection<T>
  ): Promise<T | null>;
  findOne<T = U>(
    where: Where<T>,
    projection?: QueryProjection<T>
  ): Promise<T | null>;
  findAll<T = U>(
    where?: Where<T>,
    projection?: QueryProjection<T>
  ): Promise<T[]>;
  deleteMany(where: Where<U>): Promise<void>;
}

/**
 * Builds a generic MongoDB crud repository.
 * @param dbName The name of the Mongo database to use
 * @param colName The name of the Mongo collection to use
 * @returns The class instance
 */
export const buildMongoRepository =
  <U, C = OmitId<U>>(
    dbName: MongoDbName,
    colName: MongoDbCollectionName,
    defaultProjection: QueryProjection
  ) =>
  async (request: AnyRequest): Promise<Repository<U, C>> => {
    const defaultMongoOpts = {
      projection: { _id: 0, projection: defaultProjection }
    };

    const RepositoryClass = class implements Repository<U, C> {
      constructor(private readonly collection: Collection<Document>) {}

      async create(data: C): Promise<InsertOneResult<Document>> {
        return await this.collection.insertOne(data);
      }

      async findUnique<T = U>(
        id: string | ObjectId,
        projection?: QueryProjection<T>
      ): Promise<T | null> {
        let sanitizedId: ObjectId;

        if (typeof id === 'string') {
          const sanitizedIdResult = mongoObjectIdSanitizer(id);
          if (!sanitizedIdResult) {
            return null;
          }

          sanitizedId = sanitizedIdResult;
        } else {
          sanitizedId = id;
        }

        const mongoOpts = projection ? { projection } : defaultMongoOpts;

        return await this.collection.findOne<T>(
          { _id: sanitizedId },
          mongoOpts
        );
      }

      async findOne<T = U>(
        where: Where<T>,
        projection?: QueryProjection<T>
      ): Promise<T | null> {
        const mongoOpts = projection ? { projection } : defaultMongoOpts;

        return await this.collection.findOne<T>(where, mongoOpts);
      }

      async findAll<T = U>(
        where: Where<T>,
        projection?: QueryProjection<T>
      ): Promise<T[]> {
        const mongoOpts = projection ? { projection } : defaultMongoOpts;

        return await this.collection.find<T>(where, mongoOpts).toArray();
      }

      async deleteMany(where: Where<U>): Promise<void> {
        await this.collection.deleteMany(where);
      }
    };

    return new RepositoryClass(
      await request.getMongoCollection(dbName, colName)
    );
  };

/**
 * A middleware that attaches a repository to the Express request.
 * @returns
 */
export function repository<U>(
  repo: ReturnType<typeof buildMongoRepository>
): any {
  return async (req: RepositoryRequest<U>, _: Response, next: NextFunction) => {
    req.repository = await repo(req);

    next();
  };
}

/**
 * A request that uses a repository with the repository middleware.
 */
export interface RepositoryRequest<U, C = OmitId<U>> extends Request {
  repository: Repository<U, C>;
}
