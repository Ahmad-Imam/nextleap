"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import {
  coverLetterJobInputSchema,
  createJobPostSchema,
  deleteJobPostInputSchema,
  generateJobPostInputSchema,
  jobIdSchema,
  timelinePointSchema,
  updateJobPostInputSchema,
  updateBookmarkInputSchema,
  updateCoverLetterInputSchema,
  updateJobNotesInputSchema,
} from "@/lib/validators/job";
import { getUser } from "./user";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

function cleanModelJson(text) {
  if (!text) {
    throw new Error("Empty response from model");
  }

  const withoutFences = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(withoutFences);
  } catch {
    const match = withoutFences.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Model did not return valid JSON");
    }
    return JSON.parse(match[0]);
  }
}

function parseOrThrow(schema, input) {
  const parsed = schema.safeParse(input);
  if (parsed.success) {
    return parsed.data;
  }
  const message = parsed.error.issues?.[0]?.message || "Invalid input data";
  throw new Error(message);
}

function compactHtmlForPrompt(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/\s+/g, " ")
    .slice(0, 60000);
}

async function normalizeJobPostToEnglish(jobPost) {
  const prompt = `
You are given parsed job data. Translate all human-readable text values to English.
Return strict JSON only.

Rules:
- Keep keys exactly the same.
- Keep null values as null.
- Keep arrays as arrays of English strings.
- Normalize enum values exactly as:
  - jobType: "FULL TIME" | "PART TIME" | "CONTRACT" | "INTERNSHIP" | null
  - industry: "TECH" | "FINANCE" | "HEALTHCARE" | "EDUCATION" | "RETAIL" | "MANUFACTURING" | null
  - level: "Entry" | "Mid" | "Senior" | null
- Do not include markdown, comments, or explanations.

Input JSON:
${JSON.stringify(jobPost)}
`;

  const result = await model.generateContent(prompt);
  return cleanModelJson(result.response.text());
}

function formatMultilineField(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .join("\n");
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
}

export async function generateJobPost(url) {
  const input = parseOrThrow(generateJobPostInputSchema, url);

  const urlResponse = await fetch(input.url);
  if (!urlResponse.ok) {
    throw new Error("Unable to fetch and parse the job URL.");
  }
  const html = compactHtmlForPrompt(await urlResponse.text());

  const prompt = `
Extract job details from this HTML and return strict JSON only.
All text fields must be in English. If source text is in another language, translate to English.

Output schema (all keys required):
{
  "jobTitle": string | null,
  "jobDescription": string | null,
  "companyName": string | null,
  "location": string | null,
  "salary": string | null,
  "jobType": "FULL TIME" | "PART TIME" | "CONTRACT" | "INTERNSHIP" | null,
  "industry": "TECH" | "FINANCE" | "HEALTHCARE" | "EDUCATION" | "RETAIL" | "MANUFACTURING" | null,
  "level": "Entry" | "Mid" | "Senior" | null,
  "jobRequirements": string[] | null,
  "responsibilities": string[] | null
}

If a field is missing, use null.
Do not include HTML tags in values.
Do not include markdown or extra text.

HTML:
${html}
`;

  const result = await model.generateContent(prompt);
  const extractedJobPost = cleanModelJson(result.response.text());
  const englishJobPost = await normalizeJobPostToEnglish(extractedJobPost);

  return {
    ...englishJobPost,
    jobRequirements: formatMultilineField(englishJobPost?.jobRequirements),
    responsibilities: formatMultilineField(englishJobPost?.responsibilities),
  };
}

export async function addJobPost(jobPost) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }
  const parsedJobPost = parseOrThrow(createJobPostSchema, jobPost);

  const updatedJobPost = {
    ...parsedJobPost,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const newJobPost = await db.job.create({
    data: {
      ...updatedJobPost,
    },
  });

  return newJobPost;
}

export async function updateJobPost(jobId, jobPost) {
  const user = await getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const parsedInput = parseOrThrow(updateJobPostInputSchema, {
    jobId,
    jobPost,
  });

  const updatedJobPost = await db.job.update({
    where: {
      id: parsedInput.jobId,
      userId: user.id,
    },
    data: {
      ...parsedInput.jobPost,
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/job/${parsedInput.jobId}`);
  revalidatePath(`/job/${parsedInput.jobId}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/jobs");
  revalidatePath("/dashboard/bookmarks");
  revalidatePath("/dashboard/applications");

  return updatedJobPost;
}

export async function deleteJobPost(jobId) {
  const user = await getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const parsedInput = parseOrThrow(deleteJobPostInputSchema, { jobId });

  await db.job.delete({
    where: {
      id: parsedInput.jobId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/jobs");
  revalidatePath("/dashboard/bookmarks");
  revalidatePath("/dashboard/applications");

  return { success: true };
}

export async function updateJobNotes(jobId, notes) {
  const user = await getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const parsedInput = parseOrThrow(updateJobNotesInputSchema, { jobId, notes });

  const updatedJobPost = await db.job.update({
    where: {
      id: parsedInput.jobId,
      userId: user.id,
    },
    data: {
      notes: parsedInput.notes,
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/job/${parsedInput.jobId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/jobs");

  return { success: true, notes: updatedJobPost.notes };
}

export async function getJobPosts() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  const jobPosts = await db.job.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobPosts;
}

export async function getJobPostById(id) {
  const user = await getUser();
  const parsedJobId = parseOrThrow(jobIdSchema, id);

  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  const jobPost = await db.job.findUnique({
    where: {
      id: parsedJobId,
      userId: user.id,
    },
  });

  return jobPost;
}

export async function addTimelinePoint(jobId, newTimelinePoint) {
  const user = await getUser();
  const parsedJobId = parseOrThrow(jobIdSchema, jobId);
  const parsedTimelinePoint = parseOrThrow(timelinePointSchema, newTimelinePoint);

  const normalizedTimelinePoint = {
    ...parsedTimelinePoint,
    date: parsedTimelinePoint.date.toISOString(),
    position: parsedTimelinePoint.position || "left",
  };

  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  const updatedJobPost = await db.job.update({
    where: {
      id: parsedJobId,
      userId: user.id,
    },
    data: {
      status: normalizedTimelinePoint.type,
      timeline: {
        push: normalizedTimelinePoint,
      },
    },
  });
  revalidatePath(`/job/${parsedJobId}`);
  revalidatePath("/dashboard");

  return normalizedTimelinePoint;
}

export async function updateJobBookmark(jobId, isBookmark) {
  const user = await getUser();
  const parsedInput = parseOrThrow(updateBookmarkInputSchema, {
    jobId,
    isBookmark,
  });

  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  const updatedJobPost = await db.job.update({
    where: {
      id: parsedInput.jobId,
      userId: user.id,
    },
    data: {
      isBookmark: parsedInput.isBookmark,
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/job/${parsedInput.jobId}`);

  return updatedJobPost;
}

export async function getJobPostByBookmark() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  const jobPosts = await db.job.findMany({
    where: {
      userId: user.id,
      isBookmark: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobPosts;
}

export async function getJobPostsByApplication() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  const jobPosts = await db.job.findMany({
    where: {
      userId: user.id,
      status: {
        in: ["applied", "interview"],
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return jobPosts;
}

export async function getUpcomingInterviewsForUser() {
  const user = await getUser();
  if (!user) throw new Error("User not authenticated");

  const jobs = await db.job.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      jobTitle: true,
      companyName: true,
      timeline: true,
    },
  });

  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 15);

  const upcomingInterviews = [];

  for (const job of jobs) {
    if (!Array.isArray(job.timeline)) continue;
    const interviews = job.timeline.filter(
      (item) =>
        item.type === "interview" &&
        new Date(item.date) > now &&
        new Date(item.date) <= nextWeek,
    );

    interviews.forEach((interview) => {
      upcomingInterviews.push({
        ...interview,
        ...job,
      });
    });
  }
  upcomingInterviews.sort((a, b) => new Date(a.date) - new Date(b.date));
  return upcomingInterviews;
}

function getSubmittedDateFromJob(job) {
  if (Array.isArray(job.timeline)) {
    const appliedEvents = job.timeline
      .filter((item) => item?.type === "applied" && item?.date)
      .map((item) => new Date(item.date))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a - b);

    if (appliedEvents.length > 0) {
      return appliedEvents[0];
    }
  }

  const fallbackDate = new Date(job.updatedAt || job.createdAt);
  return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
}

function getWeekStart(date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getMonthStart(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  return start;
}

export async function getApplicationLimitAnalytics() {
  const user = await getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const submittedJobs = await db.job.findMany({
    where: {
      userId: user.id,
      NOT: {
        status: "open",
      },
    },
    select: {
      createdAt: true,
      updatedAt: true,
      timeline: true,
      status: true,
    },
  });

  const now = new Date();
  const weekStart = getWeekStart(now);
  const monthStart = getMonthStart(now);

  let weeklySubmittedCount = 0;
  let monthlySubmittedCount = 0;

  submittedJobs.forEach((job) => {
    const submittedDate = getSubmittedDateFromJob(job);
    if (!submittedDate) return;

    if (submittedDate >= weekStart && submittedDate <= now) {
      weeklySubmittedCount += 1;
    }

    if (submittedDate >= monthStart && submittedDate <= now) {
      monthlySubmittedCount += 1;
    }
  });

  const weeklyLimit = user.weeklyApplicationLimit ?? null;
  const monthlyLimit = user.monthlyApplicationLimit ?? null;

  const weeklyRemaining =
    weeklyLimit !== null ? Math.max(weeklyLimit - weeklySubmittedCount, 0) : null;
  const monthlyRemaining =
    monthlyLimit !== null ? Math.max(monthlyLimit - monthlySubmittedCount, 0) : null;

  const weeklyProgress =
    weeklyLimit && weeklyLimit > 0
      ? Math.min(Math.round((weeklySubmittedCount / weeklyLimit) * 100), 100)
      : null;
  const monthlyProgress =
    monthlyLimit && monthlyLimit > 0
      ? Math.min(Math.round((monthlySubmittedCount / monthlyLimit) * 100), 100)
      : null;

  return {
    weekly: {
      submitted: weeklySubmittedCount,
      limit: weeklyLimit,
      remaining: weeklyRemaining,
      progress: weeklyProgress,
    },
    monthly: {
      submitted: monthlySubmittedCount,
      limit: monthlyLimit,
      remaining: monthlyRemaining,
      progress: monthlyProgress,
    },
  };
}

export async function generateCoverLetter(job) {
  const user = await getUser();
  const parsedJob = parseOrThrow(coverLetterJobInputSchema, job);

  const jobContext = {
    jobTitle: parsedJob.jobTitle || null,
    companyName: parsedJob.companyName || null,
    location: parsedJob.location || null,
    industry: parsedJob.industry || null,
    level: parsedJob.level || null,
    jobType: parsedJob.jobType || null,
    jobDescription: parsedJob.jobDescription || null,
    jobRequirements: parsedJob.jobRequirements.slice(0, 10),
    responsibilities: parsedJob.responsibilities.slice(0, 10),
  };

  const userContext = {
    name: user?.name || null,
    email: user?.email || null,
    bio: user?.bio || null,
    skills: Array.isArray(user?.skills) ? user.skills : [],
    experience: Array.isArray(user?.experience) ? user.experience : [],
    projects: Array.isArray(user?.proj) ? user.proj : [],
    education: Array.isArray(user?.education) ? user.education : [],
  };

  const prompt = `
Write a high-quality, human-sounding cover letter in English for the candidate below.
Make it relevant to the role and company, with a natural tone that feels personal and specific.

Job context:
${JSON.stringify(jobContext)}

Candidate context:
${JSON.stringify(userContext)}

Hard requirements:
- Length: 220-320 words.
- Structure: 4 short paragraphs.
- Greeting: use "Dear Hiring Manager," unless a hiring manager name is explicitly provided.
- Mention the role title and company name naturally.
- Connect candidate experience/skills/projects to 2-3 job requirements or responsibilities.
- Sound confident and credible, but not exaggerated.
- Include a short closing paragraph with interest in next steps.

Quality rules:
- Avoid robotic or generic lines (e.g., "I am writing to express my interest", "team player", "fast learner").
- Do not mention AI, prompts, models, or generation.
- Do not invent facts, years, employers, metrics, or achievements not present in the context.
- If a detail is missing, write around it naturally instead of fabricating.
- No bullet points, no markdown, no HTML.

Output rules:
- Return ONLY the final cover letter text.
- Do not include any notes or explanations.
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  if (!cleanedText) {
    throw new Error("Error generating cover letter: No response from AI model");
  }

  const updatedJobPost = await updateCoverLetter(parsedJob.id, cleanedText);

  if (!updatedJobPost) {
    throw new Error("Error updating cover letter in the database");
  }
  revalidatePath(`/job/${parsedJob.id}`);
  return cleanedText;
}

export async function updateCoverLetter(jobId, coverLetter) {
  const user = await getUser();
  const parsedInput = parseOrThrow(updateCoverLetterInputSchema, {
    jobId,
    coverLetter,
  });

  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  const updatedJobPost = await db.job.update({
    where: {
      id: parsedInput.jobId,
      userId: user.id,
    },
    data: {
      coverLetter: parsedInput.coverLetter,
      updatedAt: new Date(),
    },
  });

  return updatedJobPost;
}
