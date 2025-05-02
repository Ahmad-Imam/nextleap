// Skills Section
export function skillsToMarkdown(skills = []) {
  if (!skills.length) return "";

  return `## Skills

<div style="padding:16px; margin-bottom:16px;">
  <table style="width:100%; border-collapse:collapse; background-color: white; color: black;">
    <thead>
      <tr style="background-color: white; color: black;">
        <th style="padding:8px; text-align:left; background-color: white; color: black;">Skill</th>
        <th style="padding:8px; text-align:left; background-color: white; color: black;">Experience (years)</th>
        <th style="padding:8px ; text-align:left; background-color: white; color: black;">Level</th>
      </tr>
    </thead>
    <tbody>
      ${skills
        .map(
          (s) => `<tr style="background-color: white; color: black;">
            <td style="padding:8px; background-color: white; color: black;">${
              s.name || ""
            }</td>
            <td style="padding:8px; text-align: center; background-color: white; color: black;">${
              s.exp || ""
            }</td>
            <td style="padding:8px; background-color: white; color: black;">${
              s.level || ""
            }</td>
          </tr>`
        )
        .join("")}
    </tbody>
  </table>
</div>
`;
}

// Projects Section
export function projectsToMarkdown(proj = []) {
  if (!proj.length) return "";
  return `## Projects

${proj
  .map(
    (p) => `
<div style="padding:16px; margin-bottom:16px;">
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <div style="font-size:1.1rem; font-weight:bold
      <a href="${p.url}" style=" text-decoration:underline;">
      ${p.projName || ""}</a> 
    </div>
    <div style="text-align:right;">
    ${p.tech ? `Technologies: ${p.tech}` : ""}
    </div>

  </div>
  ${
    p.url
      ? `<div style="margin:8px 0;"><a href="${p.url}" style=" text-decoration:underline;">Link</a></div>`
      : ""
  }
  ${
    p.description
      ? `<ul style="margin-top:8px; padding-left:20px;">${p.description
          .split("\n")
          .map((line) => `<li>${line}</li>`)
          .join("")}</ul>`
      : ""
  }
</div>
`
  )
  .join("\n")}
`;
}

// Education Section
export function educationToMarkdown(education = []) {
  if (!education.length) return "";
  return `## Education

${education
  .map(
    (e) => `
<div style="padding:16px; margin-bottom:16px;">
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <div>
      <div style="font-size:1.2rem; font-weight:bold;">
        ${e.degreeName || ""}${e.major ? ` in ${e.major}` : ""}
      </div>
      <div style="font-style:italic; color:#374151;">
        ${e.orgName || ""}
      </div>
    </div>
    <div style="text-align:right; color:#6b7280;">
      ${e.startDate || ""} - ${e.endDate || ""}
    </div>
  </div>
  ${
    e.result
      ? `<div style="margin-top:8px;"><strong>Result:</strong> ${e.result}</div>`
      : ""
  }
</div>
`
  )
  .join("\n")}
`;
}

// Experience Section
export function experienceToMarkdown(experience = []) {
  if (!experience.length) return "";
  return `## Experience

${experience
  .map(
    (ex) => `
<div style="padding:16px; margin-bottom:16px;">
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <div>
      <div style="font-size:1.1rem; font-weight:bold;">
        ${ex.jobName || ""}, ${ex.orgName || ""}
      </div>
      <div style="">
        ${ex.startDate || ""} - ${ex.endDate || ""}
      </div>
    </div>
    <div style="text-align:right;">
      ${ex.techStack ? `Technologies: ${ex.techStack}` : ""}
    </div>
  </div>
  ${
    ex.responsibilities
      ? `<ul style="margin-top:8px; padding-left:20px;">${ex.responsibilities
          .split("\n")
          .map((line) => `<li>${line}</li>`)
          .join("")}</ul>`
      : ""
  }
</div>
`
  )
  .join("\n")}
`;
}

// Contact Section
export function getContactMarkdown(socials = [], email, name) {
  const parts = [];
  if (email)
    parts.push(
      `<a href="mailto:${email}" style="text-decoration:underline;">📧 Email</a>`
    );
  socials.forEach((social) => {
    if (social?.url) {
      parts.push(
        `<a href="${social.url}" style="text-decoration:underline;">🌐 ${social.name}</a>`
      );
    }
  });

  return parts.length > 0
    ? `<div style="text-align:center; font-size:1.5rem; font-weight:bold; margin-bottom:8px;">${name}</div>
<div style="text-align:center; margin-bottom:16px;">${parts.join(" | ")}</div>`
    : "";
}

export function buildResumeMarkdown(user, items) {
  const sectionFns = {
    educationToMarkdown: educationToMarkdown,
    experienceToMarkdown: experienceToMarkdown,
    skillsToMarkdown: skillsToMarkdown,
    projectsToMarkdown: projectsToMarkdown,
  };

  const result = [
    getContactMarkdown(user.socials, user.email, user.name),
    user.bio ? `${user.bio}\n` : "",
  ];

  items.forEach((item) => {
    const fn = sectionFns[item.description];
    if (fn) {
      const key =
        item.description === "skillsToMarkdown"
          ? "skills"
          : item.description === "projectsToMarkdown"
          ? "proj"
          : item.description === "educationToMarkdown"
          ? "education"
          : item.description === "experienceToMarkdown"
          ? "experience"
          : null;
      if (key && user[key]) {
        result.push(fn(user[key]));
      }
    }
  });

  const parentDiv = `<div style="padding:25px;">${result
    .filter(Boolean)
    .join("\n\n")}</div>`;

  return parentDiv;
}
