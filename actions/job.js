"use server";

"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUser } from "./user";

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

  // console.log(newJobPost);

  return newJobPost;
}

export async function getJobPosts() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const jobPosts = await db.jobPosts.findMany({
    where: {
      userId: userId,
    },
  });

  return jobPosts;
}
