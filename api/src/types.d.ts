import { MongoClient } from 'mongodb';

declare global {
  declare namespace Express {
    export interface Request {
      mongoClient: MongoClient;
    }
  }
}
