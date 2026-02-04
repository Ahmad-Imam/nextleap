"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
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
  const urlResponse = await fetch(url.url);
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
  if (!jobPost) {
    throw new Error("Job post data is required");
  }

  const updatedJobPost = {
    ...jobPost,
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

  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  const jobPost = await db.job.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
  });

  return jobPost;
}

export async function addTimelinePoint(jobId, newTimelinePoint) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }
  if (!jobId) {
    throw new Error("Job ID is required");
  }
  if (!newTimelinePoint) {
    throw new Error("Timeline point data is required");
  }

  const updatedJobPost = await db.job.update({
    where: {
      id: jobId,
      userId: user.id,
    },
    data: {
      status: newTimelinePoint.type,
      timeline: {
        push: newTimelinePoint,
      },
    },
  });
  revalidatePath(`/job/${jobId}`);
  revalidatePath("/dashboard");

  return newTimelinePoint;
}

export async function updateJobBookmark(jobId, isBookmark) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const updatedJobPost = await db.job.update({
    where: {
      id: jobId,
      userId: user.id,
    },
    data: {
      isBookmark: isBookmark,
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/job/${jobId}`);

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

export async function generateCoverLetter(job) {
  const user = await getUser();

  const jobContext = {
    jobTitle: job?.jobTitle || null,
    companyName: job?.companyName || null,
    location: job?.location || null,
    industry: job?.industry || null,
    level: job?.level || null,
    jobType: job?.jobType || null,
    jobDescription: job?.jobDescription || null,
    jobRequirements: Array.isArray(job?.jobRequirements)
      ? job.jobRequirements.slice(0, 10)
      : [],
    responsibilities: Array.isArray(job?.responsibilities)
      ? job.responsibilities.slice(0, 10)
      : [],
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

  const updatedJobPost = await updateCoverLetter(job.id, cleanedText);

  if (!updatedJobPost) {
    throw new Error("Error updating cover letter in the database");
  }
  revalidatePath(`/job/${job.id}`);
  return cleanedText;
}

export async function updateCoverLetter(jobId, coverLetter) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }
  if (!jobId) {
    throw new Error("Job ID is required");
  }
  if (!coverLetter) {
    throw new Error("Cover letter data is required");
  }

  const updatedJobPost = await db.job.update({
    where: {
      id: jobId,
      userId: user.id,
    },
    data: {
      coverLetter: coverLetter,
      updatedAt: new Date(),
    },
  });

  return updatedJobPost;
}
