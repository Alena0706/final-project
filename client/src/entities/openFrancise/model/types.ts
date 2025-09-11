import type z from 'zod';
import type { createFranchiseSchema, FranchiseSchema } from './schemas';

export type FranchiseT = z.infer<typeof FranchiseSchema>;
export type FranchiseCreateT = z.infer<typeof createFranchiseSchema>;
export type FranchiseUpdateT = {
  id: number;
  name: string;
  address: string;
  workPhone: string;
  userId: number;
  image: string | null;
  video: string | null;
  description: string | null;
  city: string | null;
  createdAt?: string;
  updatedAt?: string;
};
