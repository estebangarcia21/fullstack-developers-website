import { Db, MongoClient } from 'mongodb';

declare global {
  export type MongoDbName = 'csc';

  declare namespace Express {
    export interface Request {
      getMongoDb: (dbName: MongoDbName) => Promise<Db>;
    }
  }

  declare namespace NodeJS {
    export interface ProcessEnv {
      MONGO_URL: string;
    }
  }
}
