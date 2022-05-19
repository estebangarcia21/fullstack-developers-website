import { Collection, MongoClient } from 'mongodb';

declare global {
  declare namespace NodeJS {
    export interface ProcessEnv {
      MONGO_URL: string;
      MONGO_PASSWORD: string;
      SESSION_SECRETS: string;
      CORS_ORIGIN: string;
    }
  }
}
