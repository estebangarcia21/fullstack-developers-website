import MongoStore from 'connect-mongo';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';
import session from 'express-session';
import { MongoClient } from 'mongodb';
import serverless from 'serverless-http';
import mongoClientMiddleware from './middleware/mongoClientMiddleware';
import { resUtilMiddleware } from './middleware/resUtilMiddleware';
import router from './routes';
import { SESSION_COOKIE_NAME } from './session';

const client = new MongoClient(
  process.env.MONGO_URL.replace('<password>', process.env.MONGO_PASSWORD)
);
const clientPromise = client.connect();

/**
 * Builds the express application.
 *
 * @returns The API application.
 */
export function buildApp(): express.Application {
  dotenv.config({
    path:
      process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
  });

  const app = express();

  app.use(json());

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true
    })
  );

  app.use(
    session({
      name: SESSION_COOKIE_NAME,
      secret: process.env.SESSION_SECRETS.split(','),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
        domain:
          process.env.NODE_ENV === 'production'
            ? process.env.CORS_ORIGIN
            : undefined
      },
      resave: false,
      unset: 'destroy',
      store: new MongoStore({
        clientPromise,
        dbName: 'website',
        collectionName: 'sessions'
      })
    })
  );

  app.use(mongoClientMiddleware(clientPromise));
  app.use(resUtilMiddleware);

  app.use('/api', router);

  return app;
}

export const handler = serverless(buildApp());
