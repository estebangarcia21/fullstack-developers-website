import { Request, Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import { RouterConfig } from '.';
import { CreateUserInput, UserRepository } from '../models/user';
import mongoObjectIdSanitizer from '../mongoObjectIdSanitizer';
import { checkTypedSchema } from '../typedSchema';

const route = '/users';
const router = Router();

router.get(
  '/:id',
  param('id').customSanitizer(mongoObjectIdSanitizer),
  async (req, res) => {
    const user = await UserRepository.findUnique(req, req.params!.id);
    if (!user) {
      return res.error(404, { message: 'User does not exist' });
    }

    return res.data(user);
  }
);

router.post(
  '/',
  checkTypedSchema<CreateUserInput>({
    firstName: {
      in: 'body',
      exists: {
        options: { checkFalsy: true, checkNull: true },
        errorMessage: 'First name is required'
      }
    },
    lastName: {
      in: 'body',
      exists: {
        options: { checkFalsy: true, checkNull: true },
        errorMessage: 'Last name is required'
      }
    },
    email: {
      in: 'body',
      isEmail: true,
      errorMessage: 'Email is required'
    },
    password: {
      in: 'body',
      isLength: {
        options: { min: 8, max: 20 },
        errorMessage: 'Password must be between 8 and 20 characters'
      },
      exists: {
        errorMessage: 'Password is required'
      }
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error(400, {
        message: 'Invalid form submisson',
        data: errors.array()
      });
    }

    const { email, firstName, lastName, password } = req.body;

    const user = await UserRepository.create(req, {
      email,
      firstName,
      lastName,
      password
    });

    if (!user) {
      return res.error(400, {
        message: 'User under the specified email address already exists',
        code: 'EXISTING_EMAIL'
      });
    }

    return res.data(user);
  }
);

export default { route, router } as RouterConfig;