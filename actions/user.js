"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const GENERAL_SKILL_TYPE = "General";

function normalizeSkillTypes(skillTypes) {
  const rawValues = Array.isArray(skillTypes) ? skillTypes : [];

  const normalized = rawValues
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && typeof item.value === "string") {
        return item.value.trim();
      }
      return "";
    })
    .filter(Boolean);

  const deduped = [...new Set(normalized.map((value) => value.toLowerCase()))].map(
    (lowered) =>
      normalized.find((value) => value.toLowerCase() === lowered) || lowered,
  );

  if (!deduped.some((value) => value.toLowerCase() === "general")) {
    deduped.unshift(GENERAL_SKILL_TYPE);
  }

  return deduped;
}

function normalizeSkills(skills, validTypes) {
  if (!Array.isArray(skills)) return [];

  const loweredTypes = new Set(validTypes.map((value) => value.toLowerCase()));

  return skills.map((skill) => {
    if (!skill || typeof skill !== "object") {
      return {
        name: "",
        exp: "",
        level: "",
        type: GENERAL_SKILL_TYPE,
      };
    }

    const rawType = typeof skill.type === "string" ? skill.type.trim() : "";
    const safeType =
      rawType && loweredTypes.has(rawType.toLowerCase())
        ? validTypes.find((value) => value.toLowerCase() === rawType.toLowerCase()) ||
          rawType
        : GENERAL_SKILL_TYPE;

    return {
      ...skill,
      type: safeType,
    };
  });
}

export async function updateUserOnboard(data) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const skillTypes = normalizeSkillTypes(data?.skillTypes ?? user.skillTypes ?? []);
    const skills = normalizeSkills(data?.skills, skillTypes);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        socials: data.socials,
        bio: data.bio,
        skills,
        skillTypes,
      },
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to update user");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        bio: true,
      },
    });

    return {
      isOnboarded: !!user?.bio,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}

export async function getUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
}

export async function updateUser(formData) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }
  if (!formData) {
    throw new Error("No form data found");
  }

  try {
    const payload = { ...formData };

    if ("skillTypes" in formData || "skills" in formData) {
      const skillTypes = normalizeSkillTypes(
        formData.skillTypes ?? user.skillTypes ?? [],
      );
      payload.skillTypes = skillTypes;

      if ("skills" in formData) {
        payload.skills = normalizeSkills(formData.skills, skillTypes);
      }
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...payload,
      },
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to update user");
  }
}

export async function updateUserResumeContent(resumeContent) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }
  if (!resumeContent) {
    throw new Error("No resume content found");
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        resumeContent,
      },
    });
    revalidatePath("/dashboard/resume");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to update user resume content");
  }
}

export async function getUserResumes() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!user.id) {
    throw new Error("User not found");
  }

  try {
    const userResumeContent = await db.user.findUnique({
      where: { id: user.id },
      include: {
        resume: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return userResumeContent;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to get user resume content");
  }
}
