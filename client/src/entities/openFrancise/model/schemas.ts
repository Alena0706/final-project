import z from "zod";

export const FranchiseSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  workPhone: z.string(),
  userId: z.number(),
  image: z.string().nullable(),
  video: z.string().nullable(),
  description: z.string().nullable(),
  city: z.string().nullable(),

});

export const createFranchiseSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  workPhone: z.string().optional(),
  userId: z.number().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
});

export const updateFranchiseSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  workPhone: z.string().optional(),
  userId: z.number().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
});



