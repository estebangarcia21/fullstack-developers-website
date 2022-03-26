import { Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import { RouterConfig } from '.';
import permissions from '../middleware/permissions';
import {
  Assignment,
  CreateAssignmentInput,
  Resource
} from '../models/assignment';
import mongoObjectIdSanitizer from '../mongoObjectIdSanitizer';
import { repository, RepositoryRequest } from '../repo';
import { checkTypedSchema } from '../typedSchema';

const route = '/assignments';
const router = Router();

router.use('/', repository('website', 'assignments'));
type AssignmentsRequest = RepositoryRequest<Assignment>;

router.get('/', async (req: AssignmentsRequest, res: Response) => {
  const data = await req.repository.findAll();
  return res.data(data);
});

router.post(
  '/',
  permissions('admin'),
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
  async (req: AssignmentsRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error(400, {
        message: 'Invalid form submisson',
        data: errors.array()
      });
    }

    const { title, description, week, resources } = req.body;

    const assignmentResult = await req.repository.findOne({ week });
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

    const assignment = await req.repository.create(input);
    res.data(assignment);
  }
);

router.put(
  '/',
  permissions('admin'),
  param('id').exists().customSanitizer(mongoObjectIdSanitizer),
  async (req, res) => {}
);

router.delete(
  '/:id',
  permissions('admin'),
  param('id').customSanitizer(mongoObjectIdSanitizer),
  async (req, res) => {}
);

export default { route, router } as RouterConfig;
