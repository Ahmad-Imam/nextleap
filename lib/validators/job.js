import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null);

const optionalUrl = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  },
  z
    .string()
    .url()
    .nullable()
    .optional()
    .transform((value) => value ?? null),
);

export const generateJobPostInputSchema = z.object({
  url: z.string().trim().url("Please provide a valid job URL."),
});

export const createJobPostSchema = z.object({
  applicationLink: optionalUrl.nullable().optional(),
  jobTitle: z
    .string()
    .trim()
    .min(1, "Job title is required.")
    .max(200, "Job title is too long."),
  jobDescription: z
    .string()
    .trim()
    .min(1, "Job description is required.")
    .max(15000, "Job description is too long."),
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required.")
    .max(200, "Company name is too long."),
  location: optionalString,
  salary: optionalString,
  jobType: optionalString,
  level: optionalString,
  industry: optionalString,
  notes: z
    .string()
    .trim()
    .max(5000, "Notes are too long.")
    .optional()
    .transform((value) => value || null),
  jobRequirements: z.array(z.string().trim().min(1)).default([]),
  responsibilities: z.array(z.string().trim().min(1)).default([]),
});

export const jobIdSchema = z
  .string()
  .trim()
  .min(1, "Job id is required.");

export const timelinePointSchema = z.object({
  id: z.string().trim().min(1),
  type: z.enum(["applied", "interview", "selected", "rejected"]),
  date: z.coerce.date(),
  position: z.enum(["left", "right"]).optional(),
});

export const updateBookmarkInputSchema = z.object({
  jobId: jobIdSchema,
  isBookmark: z.boolean(),
});

export const coverLetterJobInputSchema = z.object({
  id: jobIdSchema,
  jobTitle: optionalString,
  companyName: optionalString,
  location: optionalString,
  industry: optionalString,
  level: optionalString,
  jobType: optionalString,
  jobDescription: optionalString,
  jobRequirements: z.array(z.string().trim()).optional().default([]),
  responsibilities: z.array(z.string().trim()).optional().default([]),
});

export const updateCoverLetterInputSchema = z.object({
  jobId: jobIdSchema,
  coverLetter: z
    .string()
    .trim()
    .min(1, "Cover letter cannot be empty.")
    .max(15000, "Cover letter is too long."),
});

export const updateJobPostInputSchema = z.object({
  jobId: jobIdSchema,
  jobPost: createJobPostSchema,
});

export const deleteJobPostInputSchema = z.object({
  jobId: jobIdSchema,
});

export const updateJobNotesInputSchema = z.object({
  jobId: jobIdSchema,
  notes: z
    .string()
    .trim()
    .max(5000, "Notes are too long.")
    .optional()
    .transform((value) => value || null),
});
