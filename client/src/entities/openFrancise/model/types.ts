import type z from 'zod';
import type { createFranchiseSchema, FranchiseSchema, updateFranchiseSchema } from './schemas';

export type FranchiseT = z.infer<typeof FranchiseSchema>;
export type FranchiseCreateT = z.infer<typeof createFranchiseSchema>;
export type FranchiseUpdateT = z.infer<typeof updateFranchiseSchema>;
