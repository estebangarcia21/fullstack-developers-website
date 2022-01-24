import { Request, Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import { RouterConfig } from '.';
import roleMiddleware from '../middleware/roleMiddleware';
import {
  AssignmentRepository,
  CreateAssignmentInput,
  Resource
} from '../models/assignment';
import mongoObjectIdSanitizer from '../mongoObjectIdSanitizer';
import { checkTypedSchema } from '../typedSchema';

const route = '/assignments';
const router = Router();

router.get('/', roleMiddleware('member'), async (req, res) => {
  const assignments = await AssignmentRepository.findAll(req);
  return res.data(assignments);
});

router.post(
  '/',
  roleMiddleware('admin'),
  checkTypedSchema<CreateAssignmentInput>({
    title: {
      in: 'body',
      exists: true,
      errorMessage: 'Missing title'
    },
    description: {
      in: 'body',
      exists: true,
      errorMessage: 'Missing description'
    },
    week: {
      in: 'body',
      isInt: {
        options: { min: 1 },
        errorMessage: 'Week parameter must be an integer greater than 0'
      }
    },
    resources: {
      in: 'body',
      exists: true,
      isArray: true,
      custom: {
        options: (resources: Partial<Resource>[]) => {
          if (resources.length === 0) {
            return false;
          }

          return resources.every(({ description, link, title, type }) => {
            return description && link && title && type;
          });
        },
        errorMessage: 'Invalid resource'
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

    const { title, description, week, resources } = req.body;

    const assignmentResult = await AssignmentRepository.findOne(req, { week });
    if (assignmentResult) {
      return res.error(400, {
        message: 'Assignment already exists for that week',
        code: 'EXISTING_ASSIGNMENT'
      });
    }

    const input: CreateAssignmentInput = {
      title,
      description,
      week,
      resources
    };

    const assignment = await AssignmentRepository.create(req, input);
    res.data(assignment);
  }
);

router.put(
  '/',
  roleMiddleware('admin'),
  param('id').exists().customSanitizer(mongoObjectIdSanitizer),
  async (req, res) => {}
);

router.delete(
  '/:id',
  roleMiddleware('admin'),
  param('id').customSanitizer(mongoObjectIdSanitizer),
  async (req, res) => {}
);

export default { route, router } as RouterConfig;
