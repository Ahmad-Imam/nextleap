import { z } from "zod";

export const resumeIdSchema = z
  .string()
  .trim()
  .min(1, "Resume id is required.");

export const createResumeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Resume name is required.")
    .max(200, "Resume name is too long."),
  content: z
    .string()
    .trim()
    .min(1, "Resume content is required.")
    .max(200000, "Resume content is too long."),
});

export const updateResumeNameSchema = z.object({
  resumeId: resumeIdSchema,
  newName: z
    .string()
    .trim()
    .min(1, "New resume name is required.")
    .max(200, "Resume name is too long."),
});
