import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(160).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(140).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const postUpsertSchema = z.object({
  title: z.string().trim().min(3).max(220),
  slug: z.string().trim().min(3).max(240).optional(),
  content: z.string().min(1),
  excerpt: z.string().trim().min(10).max(500),
  thumbnail: z.string().max(500).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seoTitle: z.string().trim().max(220).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(320).optional().or(z.literal("")),
  categoryId: z.string().min(3),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).optional(),
});

export const userCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(160).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
  avatar: z.string().max(500).optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().email().max(160).transform((value) => value.toLowerCase()).optional(),
  password: z.string().min(8).max(128).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  avatar: z.string().max(500).optional().or(z.literal("")),
  active: z.boolean().optional(),
});

export const menuSchema = z.array(
  z.object({
    id: z.string().optional(),
    label: z.string().trim().min(1).max(80),
    path: z.string().trim().min(1).max(240),
    order: z.coerce.number().int().min(0).max(1000),
  }),
);
