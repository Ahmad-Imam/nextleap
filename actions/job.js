"use server";

"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
            "salaryRange": "$80,000 - $120,000",
            "jobType": "FULL_TIME" | "PART_TIME" | "CONTRACT",
            "experienceLevel": "JUNIOR" | "MID" | "SENIOR",
            "industry": "TECH",
            "requirements": ["Bachelor's degree in Computer Science or related field", "3+ years of experience in software development", "proficiency in JavaScript and Python."],
            "responsibilities": ["Develop software solutions", "collaborate with cross-functional teams", "ensure code quality and performance."],
          }
          if you dont find title,description,company name,location,salary range,job type,experience level,industry,requirements,responsibilities in the html, then provide a default value null for that field.
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
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
