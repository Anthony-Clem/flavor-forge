import { z } from "zod";

export const emailSchema = z.string().email().min(1).max(255);

const passwordSchema = z.string().min(8).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const idSchema = z.string().min(1).max(255);

export const userSchema = z.object({
  id: idSchema,
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
});

export const generateRecipeSchema = z.object({
  userId: idSchema,
  dishName: z.string().min(1).max(255),
  servingSize: z.number().min(1),
});
