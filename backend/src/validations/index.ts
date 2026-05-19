import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "sales"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only alphabetic characters and spaces"),
    email: z.string().email("Invalid email address"),
    status: z.enum(["new", "contacted", "qualified", "lost"]).optional(),
    source: z.enum(["website", "instagram", "referral"]).optional(),
    assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").optional(),
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only alphabetic characters and spaces").optional(),
    email: z.string().email("Invalid email address").optional(),
    status: z.enum(["new", "contacted", "qualified", "lost"]).optional(),
    source: z.enum(["website", "instagram", "referral"]).optional(),
    assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").optional(),
  }),
});
