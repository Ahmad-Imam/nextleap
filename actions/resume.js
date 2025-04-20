"use server";

import { db } from "@/lib/prisma";
import { getUser } from "./user";

export async function createResume(resumeData) {
  const user = await getUser();

  if (!resumeData) {
    throw new Error("Resume is required");
  }

  // Assuming you have a function to save the resume to your database
  const savedResume = await db.resume.create({
    data: {
      ...resumeData,
      userId: user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return savedResume;
}

export async function getResumeById(resumeId) {
  const user = await getUser();

  if (!resumeId) {
    throw new Error("Resume ID is required");
  }

  // Assuming you have a function to fetch the resume from your database
  const resume = await db.resume.findUnique({
    where: {
      id: resumeId,
      userId: user?.id,
    },
  });

  return resume;
}

export async function updateResumeName(resumeId, newName) {
  const user = await getUser();

  if (!resumeId || !newName) {
    throw new Error("Resume ID and new name are required");
  }

  const updatedResume = await db.resume.update({
    where: {
      id: resumeId,
      userId: user?.id,
    },
    data: {
      name: newName,
      updatedAt: new Date(),
    },
  });

  return updatedResume;
}
