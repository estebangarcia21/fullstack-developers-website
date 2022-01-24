import { Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import { RouterConfig } from '.';
import { UserRepository } from '../models/user';
import { checkTypedSchema } from '../typedSchema';

const route = '/';
const router = Router();

interface LoginResult {
  success: boolean;
  message?: string;
}

router.post(
  '/login',
  checkTypedSchema({
    email: {
      in: 'body',
      exists: true,
      isEmail: true
    },
    password: {
      in: 'body',
      exists: true
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error(400, {
        data: errors.mapped()
      });
    }

    const { email, password } = req.body;
    const { result, userId } = await UserRepository.auth(req, email, password);

    if (result === 'authenticated' && req.session.userId) {
      return res.data<LoginResult>({
        success: true,
        message: 'You are already logged in'
      });
    }

    if (result === 'non existing') {
      return res.partial(401, {
        data: { success: false } as LoginResult,
        error: { message: 'User under the specified email does not exist' }
      });
    }

    if (result === 'denied') {
      return res.partial(401, {
        data: { success: false } as LoginResult,
        error: { message: 'Invalid credentials' }
      });
    }

    req.session.userId = userId;

    return res.data<LoginResult>({
      success: true,
      message: 'Successfully logged in'
    });
  }
);

router.post('/logout', async (req, res) => {
  if (!req.session.userId) {
    return res.data<LoginResult>({
      success: true,
      message: 'You were not logged in'
    });
  }

  req.session.destroy((_err) => {});

  res.data<LoginResult>({
    success: true,
    message: 'Successfully logged out'
  });
});

export default { route, router } as RouterConfig;
