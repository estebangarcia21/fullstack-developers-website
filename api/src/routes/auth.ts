import { Request, Response, Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { RouterConfig } from '.';
import { ResetPasswordTokens } from '../models/reset_password_tokens';
import { UserRequest, UserUtil } from '../models/userRepo';
import { passwordValidator } from '../passwordValidator';
import { SESSION_COOKIE_NAME } from '../session';
import { checkTypedSchema } from '../typedSchema';

const route = '/';
const router = Router();

interface LoginResult {
  success: boolean;
  message?: string;
}

router.get('/is-authenticated', (req, res) => {
  return res.data({
    auth: req.session.userId !== undefined
  });
});

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
      custom: { options: passwordValidator }
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
    const { result, userId } = await UserUtil.auth(req, email, password);

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

router.post(
  '/reset-password',
  query('email').isEmail().optional(),
  query('token').optional(),
  body('password').custom(passwordValidator),
  param('token'),
  async (req: UserRequest, res: Response) => {
    const { token, email } = (req.query as Record<string, string>) ?? {};

    const tokenDocument = await ResetPasswordTokens.findUnique(req, email);

    if (token) {
      if (!tokenDocument) {
        return res.error(400, {
          message: 'No password reset token found for the specified email'
        });
      }

      const isValidToken = await ResetPasswordTokens.verifyToken(
        req,
        email,
        token
      );

      if (!isValidToken) {
        return res.error(400, {
          message: 'Invalid password reset token'
        });
      }

      await UserUtil.updatePassword(req, email, req.body.password);
      await ResetPasswordTokens.delete(req, email);

      return res.data({ message: 'Password successfully updated' });
    }

    await ResetPasswordTokens.create(req, email);

    return res.data({ message: 'Password reset token successfully created' });
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
  res.clearCookie(SESSION_COOKIE_NAME);

  return res.data<LoginResult>({
    success: true,
    message: 'Successfully logged out'
  });
});

export default { route, router } as RouterConfig;
