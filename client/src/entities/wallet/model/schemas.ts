import z from "zod";

export const walletSchema = z.coerce.number().min(1).max(1000000);