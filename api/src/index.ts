import MongoStore from 'connect-mongo';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';
import session from 'express-session';
import { MongoClient } from 'mongodb';
import mongoClientMiddleware from './middleware/mongoClientMiddleware';
import { resUtilMiddleware } from './middleware/resUtilMiddleware';
import router from './routes';
import { SESSION_COOKIE_NAME } from './session';

/**
 * Builds the express application.
 *
 * @returns The API application.
 */
async function main() {
  if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.local' });
  }

  let mongoUrl: string;
  if (process.env.NODE_ENV === 'production') {
    mongoUrl = process.env.MONGO_URL.replace(
      '<password>',
      process.env.MONGO_PASSWORD
    ).concat('?retryWrites=true&w=majority');
  } else {
    mongoUrl = process.env.MONGO_URL;
  }

  const client = new MongoClient(mongoUrl);
  const clientPromise = client.connect();

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true
    })
  );

  app.use(json());

  app.use(
    session({
      name: SESSION_COOKIE_NAME,
      secret: process.env.SESSION_SECRETS.split(','),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 48,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: false,
        path: '/',
        domain:
          process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
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

  const port = process.env.PORT || 4000;

  app.listen(port, () =>
    console.log(`Fullstack Developers API: Listening on port ${port}`)
  );
}

main();
