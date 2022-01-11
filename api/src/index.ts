import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import serverless from 'serverless-http';

function mongoClientMiddleware(req: Request, _: Response, next: NextFunction) {
  const mongoClient = new MongoClient('mongodb://localhost:27020/mydb');
  req.mongoClient = mongoClient;

  next();
}

function buildHandler() {
  dotenv.config();

  const app = express();

  app.use(mongoClientMiddleware);

  app.get('/api', (req, res) => {
    console.log(req.mongoClient);
    res.send('Hello World!');
  });

  return serverless(app);
}

export const handler = buildHandler();
