"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUser } from "./user";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function generateJobPost(url) {
  console.log("from server");
  console.log(typeof url);
  console.log(url);
  const urlResponse = await fetch(url.url);
  const html = await urlResponse.text();

  const prompt = `
          go through this whole html ${html}, analyze them and provide results in ONLY the following JSON format without any additional notes or explanations:
          {
            "jobTitle": "Software Engineer",
            "jobDescription": "Develop and maintain software applications.",
            "companyName": "Tech Corp",
            "location": "New York, NY | Remote",
            "salary": "$80,000",
            "jobType": "FULL TIME" | "PART TIME" | "CONTRACT"| "INTERNSHIP",
            "industry": "TECH"| "FINANCE"| "HEALTHCARE"| "EDUCATION"| "RETAIL"| "MANUFACTURING",
            "level": "Entry" | "Mid" | "Senior",
            "jobRequirements": ["Bachelor's degree in Computer Science or related field", "3+ years of experience in software development", "proficiency in JavaScript and Python."],
            "responsibilities": ["Develop software solutions", "collaborate with cross-functional teams", "ensure code quality and performance."],
          }
          if you dont find title,description,company name,location,salary range,job type,experience level,industry,requirements,responsibilities in the html, then provide a default value null for that field.
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting. DONOT INLCUDE ANY HTML TAGS INSIDE THE CONTENTS.
            Make sure to include all the fields mentioned above. If any field is not found in the HTML, set its value to null.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  console.log("cleanedText");
  // console.log(cleanedText);

  return JSON.parse(cleanedText);
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
  console.log("from server addJobPost");
  // console.log(jobPost);

  const updatedJobPost = {
    ...jobPost,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // console.log(updatedJobPost);
  const newJobPost = await db.job.create({
    data: {
      ...updatedJobPost,
    },
  });

  console.log(newJobPost);

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

  //sort by createdAt in descending order
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
  // console.log(id);
  // console.log(user.id);

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

  //add timelinepoint to the timeline array of the job post

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

  // 1. Fetch all jobs for the user, including their timeline
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
        new Date(item.date) <= nextWeek
    );
    // console.log("interviews");
    // console.log(interviews);
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
  console.log("from server");
  // console.log(job);

  const user = await getUser();
  // console.log(user);

  const prompt = `
         remember you are an expert recruiter. This is the job post : ${JSON.stringify(
           job
         )} and this is the user profile : ${JSON.stringify(user)}.
          next go through the job post and user details and generate a cover letter for the job post in a professional tone
         that will make the user stand out from other applicants. The cover letter should be concise, clear, and tailored to the specific job description.Make sure to include the following details in the cover letter:
         return only the cover letter in a string format without any additional notes or explanations.
        
        IMPORTANT: Return ONLY the string content. No additional text, notes, or markdown formatting. DONOT INLCUDE ANY HTML TAGS INSIDE THE CONTENTS. DONOT CREATE HIRING MANAGER NAMES IF IT IS NOT GIVEN.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  console.log("cleanedText");
  // console.log(cleanedText);

  if (!cleanedText) {
    throw new Error("Error generating cover letter: No response from AI model");
  }

  const updatedJobPost = updateCoverLetter(job.id, cleanedText);

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
