import { Router } from 'express';

const router = Router();

router.get('/users', async ({ getMongoDb }, res) => {
  const db = await getMongoDb('csc');
  const collection = db.collection('users');

  const users = await collection.find().toArray();

  res.send(users);
});

export default router;
