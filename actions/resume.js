"use server";

import { db } from "@/lib/prisma";
import {
  createResumeSchema,
  resumeIdSchema,
  updateResumeNameSchema,
} from "@/lib/validators/resume";
import { revalidatePath } from "next/cache";
import { getUser } from "./user";

function parseOrThrow(schema, input) {
  const parsed = schema.safeParse(input);
  if (parsed.success) return parsed.data;
  const message = parsed.error.issues?.[0]?.message || "Invalid input data";
  throw new Error(message);
}

export async function createResume(resumeData) {
  const user = await getUser();
  const parsedResumeData = parseOrThrow(createResumeSchema, resumeData);

  const savedResume = await db.resume.create({
    data: {
      ...parsedResumeData,
      userId: user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return savedResume;
}

export async function getResumeById(resumeId) {
  const user = await getUser();
  const parsedResumeId = parseOrThrow(resumeIdSchema, resumeId);

  const resume = await db.resume.findUnique({
    where: {
      id: parsedResumeId,
      userId: user?.id,
    },
  });

  return resume;
}

export async function updateResumeName(resumeId, newName) {
  const user = await getUser();
  const parsedInput = parseOrThrow(updateResumeNameSchema, {
    resumeId,
    newName,
  });

  const updatedResume = await db.resume.update({
    where: {
      id: parsedInput.resumeId,
      userId: user?.id,
    },
    data: {
      name: parsedInput.newName,
      updatedAt: new Date(),
    },
  });

  return updatedResume;
}

export async function deleteResume(resumeId) {
  const user = await getUser();
  const parsedResumeId = parseOrThrow(resumeIdSchema, resumeId);

  await db.resume.delete({
    where: {
      id: parsedResumeId,
      userId: user?.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/resume");

  return { success: true };
}
