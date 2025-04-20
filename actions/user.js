"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        socials: data.socials,
        bio: data.bio,
        skills: data.skills,
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
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...formData,
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
