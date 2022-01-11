import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import serverless from 'serverless-http';
import router from './routes';

function mongoClientMiddleware(req: Request, _: Response, next: NextFunction) {
  req.getMongoDb = async (name: MongoDbName) => {
    const mongoClient = new MongoClient(process.env.MONGO_URL);
    await mongoClient.connect();

    return mongoClient.db(name);
  };

  next();
}

function buildHandler() {
  dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
  });

  const app = express();

  app.use(mongoClientMiddleware);
  app.use('/api', router);

  return serverless(app);
}

export const handler = buildHandler();
