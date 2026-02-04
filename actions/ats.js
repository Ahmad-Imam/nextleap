"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUser } from "./user";

const ATS_WEIGHTS = {
  keywordMatch: 30,
  skillsAlignment: 25,
  experienceRelevance: 20,
  sectionCompleteness: 15,
  clarityImpact: 10,
};

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "from",
  "that",
  "this",
  "will",
  "have",
  "has",
  "are",
  "our",
  "about",
  "their",
  "they",
  "them",
  "into",
  "than",
  "when",
  "what",
  "where",
  "who",
  "why",
  "how",
  "such",
  "using",
  "used",
  "ability",
  "skills",
  "skill",
  "experience",
  "requirements",
  "responsibilities",
  "role",
  "position",
  "job",
  "work",
  "team",
  "candidate",
  "strong",
  "good",
  "best",
  "high",
  "new",
  "etc",
]);

const SKILL_PATTERNS = [
  ["javascript", /\bjavascript\b|\bjs\b/i],
  ["typescript", /\btypescript\b|\bts\b/i],
  ["react", /\breact\b/i],
  ["next.js", /\bnext\.?js\b/i],
  ["node.js", /\bnode\.?js\b/i],
  ["express", /\bexpress\b/i],
  ["python", /\bpython\b/i],
  ["java", /\bjava\b/i],
  ["c++", /\bc\+\+\b/i],
  ["c#", /\bc#\b|c sharp/i],
  [".net", /\b\.net\b|dotnet/i],
  ["go", /\bgolang\b|\bgo\b/i],
  ["sql", /\bsql\b|postgres|mysql|sqlite/i],
  ["mongodb", /\bmongodb\b/i],
  ["graphql", /\bgraphql\b/i],
  ["rest api", /\brest\b|\bapi\b/i],
  ["docker", /\bdocker\b/i],
  ["kubernetes", /\bkubernetes\b|\bk8s\b/i],
  ["aws", /\baws\b|amazon web services/i],
  ["gcp", /\bgcp\b|google cloud/i],
  ["azure", /\bazure\b/i],
  ["git", /\bgit\b/i],
  ["ci/cd", /\bci\/cd\b|\bci\b|\bcd\b|pipeline/i],
  ["testing", /\btesting\b|jest|mocha|pytest|cypress/i],
  ["tailwind", /\btailwind\b/i],
  ["redux", /\bredux\b/i],
  ["figma", /\bfigma\b/i],
];

const ACTION_VERBS = [
  "built",
  "implemented",
  "developed",
  "designed",
  "led",
  "optimized",
  "improved",
  "reduced",
  "increased",
  "delivered",
  "launched",
  "created",
  "automated",
  "managed",
  "collaborated",
];

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;
const model = genAI
  ? genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })
  : null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function uniqueStrings(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function cleanModelJson(text) {
  if (!text) throw new Error("Empty LLM response");
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid LLM JSON");
    return JSON.parse(match[0]);
  }
}

function extractWords(value = "") {
  return normalizeText(value)
    .split(" ")
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

function extractSkillTerms(text = "") {
  const lowered = normalizeText(text);
  const found = [];
  SKILL_PATTERNS.forEach(([label, regex]) => {
    if (regex.test(lowered)) found.push(label);
  });
  return uniqueStrings(found);
}

function extractSectionText(content = "", title) {
  const htmlRegex = new RegExp(
    `<h2[^>]*>\\s*${title}\\s*<\\/h2>([\\s\\S]*?)(?=<h2[^>]*>|$)`,
    "i",
  );
  const markdownRegex = new RegExp(
    `##\\s*${title}[\\s\\S]*?(?=\\n##\\s|$)`,
    "i",
  );

  return content.match(htmlRegex)?.[1] || content.match(markdownRegex)?.[0] || "";
}

function hasSection(content = "", title) {
  if (!content) return false;
  const normalized = normalizeText(content);
  return (
    new RegExp(`<h2[^>]*>\\s*${title}\\s*<\\/h2>`, "i").test(content) ||
    normalized.includes(`## ${title.toLowerCase()}`) ||
    normalized.includes(title.toLowerCase())
  );
}

function extractBulletItems(content = "") {
  const htmlItems = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(
    (match) => stripHtml(match[1]),
  );
  if (htmlItems.length) return htmlItems.filter(Boolean);

  return String(content)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^([-*•]|\d+\.)\s+/.test(line))
    .map((line) => line.replace(/^([-*•]|\d+\.)\s+/, "").trim())
    .filter(Boolean);
}

function extractJobContext(job) {
  const requirementList = Array.isArray(job.jobRequirements)
    ? job.jobRequirements
    : [];
  const responsibilitiesList = Array.isArray(job.responsibilities)
    ? job.responsibilities
    : [];

  const baseText = [
    job.jobTitle,
    job.jobDescription,
    job.industry,
    job.level,
    job.jobType,
    requirementList.join(" "),
    responsibilitiesList.join(" "),
  ]
    .filter(Boolean)
    .join(" ");

  const wordCounts = {};
  extractWords(baseText).forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  const frequentTerms = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, 25)
    .map(([word]) => word);

  const explicitSkills = extractSkillTerms(baseText);
  const keywords = uniqueStrings([...explicitSkills, ...frequentTerms]).slice(0, 25);
  const requiredSkills = explicitSkills.length
    ? explicitSkills
    : keywords.slice(0, 10);

  return {
    keywords,
    requiredSkills,
    requirementList,
    responsibilitiesList,
  };
}

function buildDeterministicBreakdown(job, resume) {
  const resumeText = normalizeText(resume.content || "");
  const resumePlainText = stripHtml(resume.content || "");
  const resumeContent = resume.content || "";

  const { keywords, requiredSkills, requirementList, responsibilitiesList } =
    extractJobContext(job);

  const matchedKeywords = keywords.filter((keyword) =>
    resumeText.includes(normalizeText(keyword)),
  );
  const missingKeywords = keywords.filter(
    (keyword) => !matchedKeywords.includes(keyword),
  );
  const keywordScore = keywords.length
    ? Math.round((matchedKeywords.length / keywords.length) * 100)
    : 50;

  const resumeSkills = extractSkillTerms(resumePlainText);
  const matchedSkills = requiredSkills.filter((skill) => resumeSkills.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !matchedSkills.includes(skill));
  const skillsScore = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : keywordScore;

  const experienceText = normalizeText(extractSectionText(resumeContent, "experience"));
  const experienceKeywordPool = uniqueStrings([...requiredSkills, ...keywords]).slice(0, 15);
  const experienceMatches = experienceKeywordPool.filter((item) =>
    experienceText.includes(normalizeText(item)),
  );
  const experienceOverlapScore = experienceKeywordPool.length
    ? Math.round((experienceMatches.length / experienceKeywordPool.length) * 100)
    : 55;
  const yearsMatches = [
    ...resumePlainText.matchAll(/(\d+)\+?\s*(years?|yrs?)/gi),
  ].map((match) => Number(match[1]));
  const highestYears = yearsMatches.length ? Math.max(...yearsMatches) : 0;
  const level = normalizeText(job.level || "");
  let levelScore = 70;
  if (level.includes("senior")) {
    levelScore = highestYears >= 5 ? 100 : highestYears >= 3 ? 70 : 40;
  } else if (level.includes("mid")) {
    levelScore = highestYears >= 2 ? 100 : highestYears >= 1 ? 70 : 40;
  } else if (level.includes("entry")) {
    levelScore = highestYears >= 1 ? 85 : 100;
  }
  const experienceScore = Math.round(
    experienceOverlapScore * 0.7 + levelScore * 0.3,
  );

  const sectionChecks = [
    { key: "summary", label: "Professional Summary", has: hasSection(resumeContent, "professional summary") || hasSection(resumeContent, "summary") },
    { key: "skills", label: "Skills", has: hasSection(resumeContent, "skills") },
    { key: "experience", label: "Experience", has: hasSection(resumeContent, "experience") },
    { key: "education", label: "Education", has: hasSection(resumeContent, "education") },
    { key: "projects", label: "Projects", has: hasSection(resumeContent, "projects") },
    { key: "contact", label: "Contact", has: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(resumePlainText) },
  ];
  const presentSections = sectionChecks.filter((s) => s.has).map((s) => s.label);
  const missingSections = sectionChecks.filter((s) => !s.has).map((s) => s.label);
  const sectionScore = Math.round((presentSections.length / sectionChecks.length) * 100);

  const bulletItems = extractBulletItems(resumeContent);
  const bulletCount = bulletItems.length;
  const quantifiedBullets = bulletItems.filter((line) =>
    /(\d+%|\$\d+|\d+\+?|\b\d+\b)/.test(line),
  );
  const actionVerbBullets = bulletItems.filter((line) =>
    ACTION_VERBS.some((verb) => new RegExp(`\\b${verb}\\b`, "i").test(line)),
  );
  const quantifiedRatio = bulletCount
    ? quantifiedBullets.length / bulletCount
    : 0;
  const actionVerbRatio = bulletCount ? actionVerbBullets.length / bulletCount : 0;
  const structureScore = Math.min(100, Math.round((Math.min(bulletCount, 10) / 10) * 100));
  const clarityScore = bulletCount
    ? Math.round(
        quantifiedRatio * 50 * 2 + actionVerbRatio * 30 * 2 + structureScore * 0.2,
      )
    : 45;

  return {
    baseScores: {
      keywordMatch: clamp(keywordScore, 0, 100),
      skillsAlignment: clamp(skillsScore, 0, 100),
      experienceRelevance: clamp(experienceScore, 0, 100),
      sectionCompleteness: clamp(sectionScore, 0, 100),
      clarityImpact: clamp(clarityScore, 0, 100),
    },
    details: {
      keywordMatch: {
        matchedCount: matchedKeywords.length,
        totalKeywords: keywords.length,
        matchedKeywords: matchedKeywords.slice(0, 20),
        missingKeywords: missingKeywords.slice(0, 20),
        scoreLogic: "matchedKeywords / totalKeywords * 100",
      },
      skillsAlignment: {
        requiredSkillsFound: matchedSkills.length,
        requiredSkillsTotal: requiredSkills.length,
        matchedSkills,
        missingRequiredSkills: missingSkills,
        sourceRequirements: requirementList.slice(0, 6),
        sourceResponsibilities: responsibilitiesList.slice(0, 6),
        scoreLogic: "requiredSkillsFound / requiredSkillsTotal * 100",
      },
      experienceRelevance: {
        highestYearsMentioned: highestYears,
        levelTarget: job.level || null,
        keywordOverlapCount: experienceMatches.length,
        keywordOverlapTotal: experienceKeywordPool.length,
        matchedExperienceKeywords: experienceMatches,
        scoreLogic: "70% keyword overlap + 30% level alignment",
      },
      sectionCompleteness: {
        present: presentSections,
        missing: missingSections,
        scoreLogic: "presentSections / 6 * 100",
      },
      clarityImpact: {
        totalBulletPoints: bulletCount,
        bulletsWithMetrics: quantifiedBullets.length,
        bulletsWithActionVerbs: actionVerbBullets.length,
        weakBulletExamples: bulletItems
          .filter((line) => !/(\d+%|\$\d+|\d+\+?|\b\d+\b)/.test(line))
          .slice(0, 3),
        scoreLogic: "metrics ratio + action verbs ratio + bullet structure",
      },
    },
    fallbackStrengths: [
      matchedSkills.length
        ? `Matched ${matchedSkills.length} required skill(s): ${matchedSkills
            .slice(0, 3)
            .join(", ")}`
        : null,
      matchedKeywords.length
        ? `Matched ${matchedKeywords.length} relevant keyword(s)`
        : null,
      missingSections.length === 0 ? "All major resume sections are present" : null,
    ].filter(Boolean),
    fallbackGaps: [
      missingSkills.length
        ? `Missing required skills: ${missingSkills.slice(0, 3).join(", ")}`
        : null,
      missingKeywords.length
        ? `Missing keywords: ${missingKeywords.slice(0, 4).join(", ")}`
        : null,
      missingSections.length
        ? `Missing sections: ${missingSections.join(", ")}`
        : null,
    ].filter(Boolean),
    fallbackSuggestions: [
      missingSkills.length
        ? {
            priority: "high",
            title: "Add missing required skills",
            action: `Add evidence for ${missingSkills
              .slice(0, 3)
              .join(", ")} in Skills or Experience.`,
          }
        : null,
      quantifiedBullets.length < Math.max(2, Math.ceil(bulletCount * 0.3))
        ? {
            priority: "high",
            title: "Add measurable impact in bullets",
            action: "Update experience bullets with metrics (%, $, time saved).",
          }
        : null,
      missingSections.length
        ? {
            priority: "medium",
            title: "Complete key resume sections",
            action: `Add: ${missingSections.join(", ")}.`,
          }
        : null,
    ].filter(Boolean),
  };
}

async function getLlmInsights(job, resume, deterministic) {
  if (!model) return null;

  const prompt = `
You are an ATS reviewer. Return strict JSON only.

Job context:
${JSON.stringify({
  title: job.jobTitle,
  company: job.companyName,
  description: job.jobDescription,
  requirements: job.jobRequirements,
  responsibilities: job.responsibilities,
  level: job.level,
  industry: job.industry,
})}

Resume excerpt:
${stripHtml(resume.content).slice(0, 8000)}

Deterministic metrics:
${JSON.stringify(deterministic)}

Return JSON schema:
{
  "adjustments": {
    "keywordMatch": number,
    "skillsAlignment": number,
    "experienceRelevance": number,
    "sectionCompleteness": number,
    "clarityImpact": number
  },
  "categoryNotes": {
    "keywordMatch": string,
    "skillsAlignment": string,
    "experienceRelevance": string,
    "sectionCompleteness": string,
    "clarityImpact": string
  },
  "topStrengths": string[],
  "topGaps": string[],
  "suggestions": [
    {
      "priority": "high" | "medium" | "low",
      "title": string,
      "action": string
    }
  ]
}

Rules:
- adjustments must be between -10 and 10.
- Provide max 4 strengths, max 4 gaps, max 6 suggestions.
- Suggestions must be concrete and resume-edit focused.
- No markdown, no commentary outside JSON.
`;

  try {
    const result = await model.generateContent(prompt);
    return cleanModelJson(result.response.text());
  } catch {
    return null;
  }
}

function toWeightedBreakdown(scores, notes = {}) {
  const keys = Object.keys(ATS_WEIGHTS);
  const weighted = {};
  keys.forEach((key) => {
    const score = clamp(Number(scores[key] || 0), 0, 100);
    const weight = ATS_WEIGHTS[key];
    weighted[key] = {
      score,
      weight,
      contribution: Number(((score * weight) / 100).toFixed(1)),
      note: notes[key] || null,
    };
  });
  return weighted;
}

function calculateOverallScore(weightedBreakdown) {
  const total = Object.values(weightedBreakdown).reduce(
    (sum, item) => sum + item.contribution,
    0,
  );
  return clamp(Math.round(total), 0, 100);
}

export async function analyzeResumeAtsForJob({ jobId, resumeId }) {
  if (!jobId || !resumeId) {
    throw new Error("Job and resume are required");
  }

  const user = await getUser();
  if (!user?.id) throw new Error("Unauthorized");

  const job = await db.job.findFirst({
    where: { id: jobId, userId: user.id },
    select: {
      id: true,
      jobTitle: true,
      companyName: true,
      jobDescription: true,
      jobRequirements: true,
      responsibilities: true,
      industry: true,
      level: true,
      jobType: true,
    },
  });

  if (!job) throw new Error("Job not found");

  const resume = await db.resume.findFirst({
    where: { id: resumeId, userId: user.id },
    select: {
      id: true,
      name: true,
      content: true,
      updatedAt: true,
    },
  });

  if (!resume) throw new Error("Resume not found");
  if (!resume.content) throw new Error("Selected resume has no content");

  const deterministic = buildDeterministicBreakdown(job, resume);
  const llmInsights = await getLlmInsights(job, resume, deterministic);

  const finalScores = { ...deterministic.baseScores };
  Object.keys(ATS_WEIGHTS).forEach((key) => {
    const adjustment = clamp(Number(llmInsights?.adjustments?.[key] || 0), -10, 10);
    finalScores[key] = clamp(Math.round(finalScores[key] + adjustment), 0, 100);
  });

  const weightedBreakdown = toWeightedBreakdown(
    finalScores,
    llmInsights?.categoryNotes,
  );
  const overallScore = calculateOverallScore(weightedBreakdown);

  return {
    jobId: job.id,
    resumeId: resume.id,
    resumeName: resume.name,
    overallScore,
    weightedBreakdown,
    details: deterministic.details,
    topStrengths:
      llmInsights?.topStrengths?.slice(0, 4) || deterministic.fallbackStrengths,
    topGaps: llmInsights?.topGaps?.slice(0, 4) || deterministic.fallbackGaps,
    suggestions:
      llmInsights?.suggestions?.slice(0, 6) || deterministic.fallbackSuggestions,
    version: "ats_v1",
    analyzedAt: new Date().toISOString(),
  };
}
