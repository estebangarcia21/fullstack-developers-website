import { ObjectId } from 'mongodb';
import { AnyRequest } from '.';
import mongoObjectIdSanitizer from '../mongoObjectIdSanitizer';

export type Assignment = AssignmentDocument;

export type CreateAssignmentInput = Omit<AssignmentDocument, '_id'>;

interface AssignmentDocument {
  _id: ObjectId;
  title: string;
  description: string;
  week: number;
  resources: Resource[];
}

export interface Resource {
  title: string;
  type: 'video' | 'document' | 'quiz';
  link: string;
  description: string;
}

export class AssignmentRepository {
  static async findUnique(
    req: AnyRequest,
    id: string
  ): Promise<Assignment | null> {
    const col = await req.getMongoCollection('website', 'assignments');

    const sanitizedId = mongoObjectIdSanitizer(id);
    if (!sanitizedId) {
      return null;
    }

    return await col.findOne<Assignment>({ _id: id });
  }

  static async findOne(
    req: AnyRequest,
    where: Partial<Omit<Assignment, '_id'>>
  ): Promise<Assignment | null> {
    const col = await req.getMongoCollection('website', 'assignments');

    return await col.findOne<Assignment>(where);
  }

  static async findAll(req: AnyRequest): Promise<Assignment[]> {
    const col = await req.getMongoCollection('website', 'assignments');

    return await col.find<Assignment>({}).toArray();
  }

  static async create(req: AnyRequest, input: CreateAssignmentInput) {
    const col = await req.getMongoCollection('website', 'assignments');

    return await col.insertOne(input);
  }
}
