// Skills Section
export function skillsToMarkdown(skills = []) {
  if (!skills.length) return "";
  return `## Skills

| Skill | Experience (years) | Level |
|-------|--------------------|-------|
${skills
  .map((s) => `| ${s.name || ""} | ${s.exp || ""} | ${s.level || ""} |`)
  .join("\n")}
`;
}

// Projects Section
export function projectsToMarkdown(proj = []) {
  if (!proj.length) return "";
  return `## Projects

${proj
  .map(
    (p) => `### ${p.projName || ""}
**Tech Stack:** ${p.tech || ""}
${p.url ? `**URL:** [${p.url}](${p.url})` : ""}
${
  p.description
    ? p.description
        .split("\n")
        .map((line) => `- ${line}`)
        .join("\n")
    : ""
}
`
  )
  .join("\n")}
`;
}

// Education Section
// Education Section
export function educationToMarkdown(education = []) {
  if (!education.length) return "";
  return `## Education

${education
  .map(
    (e) => `**${e.degreeName || ""}${e.major ? ` in ${e.major}` : ""}**  
*${e.orgName || ""}*  
${e.startDate || ""} - ${e.endDate || ""}
${e.result ? `Result: ${e.result}` : ""}
---`
  )
  .join("\n\n")}
`;
}

// Experience Section
export function experienceToMarkdown(experience = []) {
  if (!experience.length) return "";
  return `## Experience

${experience
  .map(
    (ex) => `### ${ex.jobName || ""}, ${ex.orgName || ""} (${
      ex.startDate || ""
    } - ${ex.endDate || ""})${ex.techStack ? ` — \`${ex.techStack}\`` : ""}
${
  ex.responsibilities
    ? ex.responsibilities
        .split("\n")
        .map((line) => `- ${line}`)
        .join("\n")
    : ""
}`
  )
  .join("\n\n")}
`;
}

// Contact Section
export function getContactMarkdown(socials = [], email, name) {
  const parts = [];
  if (email) parts.push(`📧 [Email](${email})`);
  socials.map((social) => {
    if (social?.url) {
      parts.push(`🌐 [${social?.name}](${social?.url})`);
    }
  });

  return parts.length > 0
    ? `## <div align="center">${name}</div>
<div align="center">${parts.join(" | ")}</div>`
    : "";
}

// Combine all sections for the full CV
export function buildResumeMarkdown(user) {
  return [
    getContactMarkdown(user.socials, user.email, user.name),
    user.bio ? `## Bio\n\n${user.bio}\n` : "",
    skillsToMarkdown(user.skills),
    projectsToMarkdown(user.proj),
    educationToMarkdown(user.education),
    experienceToMarkdown(user.experience),
  ]
    .filter(Boolean)
    .join("\n\n");
}
