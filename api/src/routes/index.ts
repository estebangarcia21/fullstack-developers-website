import { Router } from 'express';
import assignments from './assignments';
import user from './user';
import auth from './auth';

export interface RouterConfig {
  route: string;
  router: Router;
}

const router = Router();

router.use(assignments.route, assignments.router);
router.use(user.route, user.router);
router.use(auth.route, auth.router);

export default router;
