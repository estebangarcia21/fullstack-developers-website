import { ObjectId } from 'mongodb';
import { buildMongoRepository } from '../repo';

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

export const AssignmentsRepository = buildMongoRepository<Assignment>(
  'website',
  'assignments',
  {}
);
