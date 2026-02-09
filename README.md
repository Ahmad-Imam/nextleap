# NextLeap

Live: https://nextleap-one.vercel.app

## Overview

NextLeap is a job and resume management app built with Next.js (App Router), Prisma, and NeonDB. It helps users track job applications, generate tailored cover letters, build resumes, and measure ATS match scores.

## Tech Stack

- Next.js 15 + React 19
- Prisma + PostgreSQL (Neon)
- Tailwind CSS + shadcn/ui
- Clerk authentication
- Gemini (Google Generative AI)

## Getting Started

1. Install dependencies:
   - `npm install --legacy-peer-deps` (React 19 / Next 15 peer conflicts)
2. Set environment variables in `.env` (see below)
3. Run dev server:
   - `npm run dev`

## Environment Variables

These keys are required for the full feature set:

- `DATABASE_URL` - Postgres connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`

## Features

1. Track job applications with status timeline, notes, and bookmarks
2. Edit and delete tracked jobs
3. Generate ATS match score and detailed breakdown per job + selected resume
4. Generate tailored cover letters from profile + job data
5. Build and save multiple resumes, with grouped skills and custom skill types
6. Dashboard analytics, upcoming interviews, and saved applications
7. Per-user weekly/monthly application limits
8. Light/dark theme switching

## Sample Screenshots

| <img src="https://github.com/user-attachments/assets/d13368bb-b73d-4dc2-89ba-a75ced423c4d" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                 _DASHBOARD SCREEN_                                                 |

| <img src="https://github.com/user-attachments/assets/0d7e62dc-ad5d-46dd-b5a8-8591a77f4068" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                _JOB DETAILS SCREEN_                                                |

| <img src="https://github.com/user-attachments/assets/e8ce7827-95e2-4717-b143-b3deaf31dff2" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                   _ATS DETAILS_                                                    |

| <img src="https://github.com/user-attachments/assets/6a3fe85a-e44c-458c-8518-eb1cf5a30655" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                              _RESUME PREVIEW SCREEN_                                               |

| <img src="https://github.com/user-attachments/assets/3b39c294-cd78-4b4f-a302-40645a4cbe7a" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                              _RESUME BUILDER SCREEN_                                               |
|                                                                                                                    |

## Notes

- If Prisma schema changes are made, run `npx prisma generate` and apply migrations.
