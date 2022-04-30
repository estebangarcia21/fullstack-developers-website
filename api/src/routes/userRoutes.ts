import { Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import { RouterConfig } from '.';
import {
  CreateUserInput,
  UserRepository,
  UserRequest
} from '../models/userRepo';
import mongoObjectIdSanitizer from '../mongoObjectIdSanitizer';
import { passwordValidator } from '../passwordValidator';
import { repository } from '../repo';
import { checkTypedSchema } from '../typedSchema';

const route = '/users';
const router = Router();

router.use('/', repository(UserRepository));

router.get(
  '/:id',
  param('id').customSanitizer(mongoObjectIdSanitizer),
  async (req: UserRequest, res) => {
    const user = await req.repository.findUnique(req.params!.id);
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
      exists: {
        errorMessage: 'Password is required'
      },
      custom: { options: passwordValidator }
    }
  }),
  async (req: UserRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error(400, {
        message: 'Invalid form submisson',
        data: errors.array()
      });
    }

    const { firstName, lastName, password, email } = req.body;

    const user = await req.repository.create({
      firstName,
      lastName,
      email,
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
