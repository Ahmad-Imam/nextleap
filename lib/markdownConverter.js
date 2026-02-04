function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateRange(startDate, endDate) {
  const start = formatDateValue(startDate);
  const end = formatDateValue(endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end || "";
}

function toListItems(text) {
  if (!text) return "";
  const lines = String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return "";
  return `<ul style="margin:10px 0 0 0; padding-left:20px; color:#374151;">
    ${lines.map((line) => `<li style="margin-bottom:6px;">${escapeHtml(line)}</li>`).join("")}
  </ul>`;
}

function sectionTitle(title) {
  return `<h2 style="
    font-size:15px;
    letter-spacing:0.08em;
    text-transform:uppercase;
    color:#111827;
    margin:20px 0 10px 0;
    padding-bottom:4px;
    border-bottom:1px solid #d1d5db;
  ">${escapeHtml(title)}</h2>`;
}

export function skillsToMarkdown(skills = []) {
  if (!skills.length) return "";

  return `<section style="margin:24px 0;">
    ${sectionTitle("Skills")}
    <ul style="margin:0; padding-left:18px; color:#111827;">
      ${skills
        .map((skill) => {
          const name = escapeHtml(skill?.name || "");
          const level = escapeHtml(skill?.level || "");
          const exp = skill?.exp ? `${escapeHtml(skill.exp)} years` : "";
          const details = [level, exp].filter(Boolean).join(", ");
          return `<li style="margin-bottom:6px;"><strong>${name}</strong>${
            details ? ` - ${details}` : ""
          }</li>`;
        })
        .join("")}
    </ul>
  </section>`;
}

export function projectsToMarkdown(proj = []) {
  if (!proj.length) return "";

  return `<section style="margin:24px 0;">
    ${sectionTitle("Projects")}
    ${proj
      .map((project) => {
        const projectName = escapeHtml(project?.projName || "Untitled Project");
        const tech = escapeHtml(project?.tech || "");
        const url = project?.url ? escapeHtml(project.url) : "";

        return `<article style="margin:0 0 12px 0;">
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
            <div style="font-size:15px; font-weight:700; color:#111827;">
              ${
                url
                  ? `<a href="${url}" style="color:#111827; text-decoration:none;">${projectName}</a>`
                  : projectName
              }
            </div>
            ${tech ? `<div style="font-size:13px; color:#374151;">${tech}</div>` : ""}
          </div>
          ${url ? `<div style="margin-top:2px; font-size:12px;"><a href="${url}" style="color:#1d4ed8; text-decoration:none;">${url}</a></div>` : ""}
          ${toListItems(project?.description)}
        </article>`;
      })
      .join("")}
  </section>`;
}

export function educationToMarkdown(education = []) {
  if (!education.length) return "";

  return `<section style="margin:24px 0;">
    ${sectionTitle("Education")}
    ${education
      .map((entry) => {
        const degree = escapeHtml(entry?.degreeName || "");
        const major = escapeHtml(entry?.major || "");
        const institution = escapeHtml(entry?.orgName || "");
        const result = escapeHtml(entry?.result || "");
        const dates = formatDateRange(entry?.startDate, entry?.endDate);

        return `<article style="margin:0 0 12px 0;">
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
            <div>
              <div style="font-size:15px; font-weight:700; color:#111827;">
                ${degree}${major ? `, ${major}` : ""}
              </div>
              <div style="font-size:14px; color:#374151; margin-top:2px; font-style:italic;">${institution}</div>
            </div>
            <div style="font-size:13px; color:#6b7280; white-space:nowrap;">${dates}</div>
          </div>
          ${result ? `<div style="margin-top:6px; font-size:14px; color:#334155;"><strong>Result:</strong> ${result}</div>` : ""}
        </article>`;
      })
      .join("")}
  </section>`;
}

export function experienceToMarkdown(experience = []) {
  if (!experience.length) return "";

  return `<section style="margin:24px 0;">
    ${sectionTitle("Experience")}
    ${experience
      .map((entry) => {
        const role = escapeHtml(entry?.jobName || "");
        const org = escapeHtml(entry?.orgName || "");
        const techStack = escapeHtml(entry?.techStack || "");
        const dates = formatDateRange(entry?.startDate, entry?.endDate);

        return `<article style="margin:0 0 14px 0;">
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
            <div>
              <div style="font-size:15px; font-weight:700; color:#111827;">
                ${role}${org ? `, ${org}` : ""}
              </div>
              <div style="font-size:13px; color:#6b7280; margin-top:2px;">${dates}</div>
            </div>
            ${techStack ? `<div style="font-size:13px; color:#374151; text-align:right;">${techStack}</div>` : ""}
          </div>
          ${toListItems(entry?.responsibilities)}
        </article>`;
      })
      .join("")}
  </section>`;
}

export function getContactMarkdown(socials = [], email, name) {
  const links = [];

  if (email) {
    const safeEmail = escapeHtml(email);
    links.push(
      `<a href="mailto:${safeEmail}" style="color:#1d4ed8; text-decoration:none;">${safeEmail}</a>`
    );
  }

  socials.forEach((social) => {
    if (!social?.url) return;
    const socialName = escapeHtml(social.name || "Profile");
    const socialUrl = escapeHtml(social.url);
    links.push(
      `<a href="${socialUrl}" style="color:#1d4ed8; text-decoration:none;">${socialName}</a>`
    );
  });

  return `<header style="
    border-bottom:1.5px solid #111827;
    padding-bottom:10px;
    margin-bottom:14px;
  ">
    <h1 style="
      margin:0;
      font-size:30px;
      font-weight:700;
      color:#111827;
      text-align:center;
      letter-spacing:0.01em;
    ">${escapeHtml(name || "")}</h1>
    ${
      links.length
        ? `<div style="text-align:center; margin-top:8px; font-size:14px; color:#334155;">
            ${links.join('<span style="margin:0 8px; color:#94a3b8;">|</span>')}
          </div>`
        : ""
    }
  </header>`;
}

export function buildResumeMarkdown(user = {}, items = []) {
  const sectionFns = {
    educationToMarkdown,
    experienceToMarkdown,
    skillsToMarkdown,
    projectsToMarkdown,
  };

  const sectionKeyMap = {
    educationToMarkdown: "education",
    experienceToMarkdown: "experience",
    skillsToMarkdown: "skills",
    projectsToMarkdown: "proj",
  };

  const orderedItems =
    Array.isArray(items) && items.length
      ? items
      : [
          { description: "educationToMarkdown" },
          { description: "experienceToMarkdown" },
          { description: "skillsToMarkdown" },
          { description: "projectsToMarkdown" },
        ];

  const sections = [];
  orderedItems.forEach((item) => {
    const fnKey = item?.description;
    const sectionFn = sectionFns[fnKey];
    const userKey = sectionKeyMap[fnKey];
    if (!sectionFn || !userKey) return;
    sections.push(sectionFn(user[userKey] || []));
  });

  const summarySection = user?.bio
    ? `<section style="margin:16px 0;">
        ${sectionTitle("Professional Summary")}
        <p style="
          margin:0;
          color:#1f2937;
          line-height:1.6;
          font-size:14px;
          text-align:left;
        ">${escapeHtml(user.bio)}</p>
      </section>`
    : "";

  return `<div style="
    max-width:800px;
    margin:0 auto;
    padding:22px 26px;
    font-family:'Times New Roman', Times, serif;
    color:#111827;
    background:#ffffff;
  ">
    ${getContactMarkdown(user.socials || [], user.email, user.name)}
    ${summarySection}
    ${sections.filter(Boolean).join("")}
  </div>`;
}
