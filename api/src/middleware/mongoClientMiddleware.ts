import { NextFunction, Request, Response } from 'express';
import { Collection, MongoClient } from 'mongodb';
import { AnyRequest } from '../models';

export type MongoDbName = 'website';
export type MongoDbCollectionName = 'assignments' | 'users';

export async function getMongoClient(): Promise<MongoClient> {
  const mongoClient = new MongoClient(
    process.env.MONGO_URL.replace('<password>', process.env.MONGO_PASSWORD)
  );

  return await mongoClient.connect();
}

async function getMongoCollection(
  this: AnyRequest,
  db: MongoDbName,
  collection: MongoDbCollectionName
): Promise<Collection> {
  return this.mongoClient.db(db).collection(collection);
}

export default function mongoClientMiddleware(
  clientPromise: Promise<MongoClient>
) {
  return async function (req: Request, _: Response, next: NextFunction) {
    req.mongoClient = await clientPromise;
    req.getMongoCollection = getMongoCollection;

    next();
  };
}

declare global {
  namespace Express {
    export interface Request {
      mongoClient: MongoClient;
      getMongoClient: typeof getMongoClient;
      getMongoCollection: typeof getMongoCollection;
    }
  }
}
