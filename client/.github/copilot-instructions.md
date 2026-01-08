# Developer Portfolio CMS - Frontend Copilot Instructions

## Project Overview

Build the frontend for a developer portfolio powered by the headless CMS backend. The app consumes published content for projects, posts, and docs, while providing authenticated editor/admin workflows for content management. UX must be content-first, fast, and predictable.

---

## Technical Stack

- **Framework**: Next.js App Router
- **Language**: React + JavaScript (ESNext)
- **Styling**: Tailwind CSS v4 (postcss preset) + CSS modules where needed
- **Data Fetching**: `fetch` / `next` server actions where applicable
- **State**: Local component state; keep global state minimal (prefer props, server components)
- **Auth**: HTTP-only JWT cookie issued by backend; include credentials on requests
- **Routing**: App Router pages under `/app`

---

## App Structure

```
client/
├── app/
│   ├── layout.js          # Root layout, global providers, fonts
│   ├── page.js            # Home (featured projects, latest posts)
│   ├── projects/          # Project listing and detail pages
│   ├── posts/             # Blog listing and detail pages
│   ├── docs/              # Docs sections and pages
│   └── dashboard/         # Authenticated editing UI (lightweight)
├── public/                # Static assets
├── globals.css            # Tailwind base + custom tokens
├── next.config.mjs        # Runtime config (API base URL env)
└── .github/copilot-instructions.md
```

Keep files small and composable: prefer colocated components (e.g., `app/projects/[slug]/PageSections.js`).

---

## Backend Contract (consume)

Base URL: `process.env.NEXT_PUBLIC_API_BASE` (e.g., `http://localhost:5000`)

Authentication uses an HTTP-only cookie named `token`. For authenticated calls, send `credentials: "include"`.

Published content (public, no auth required):

- GET `/projects` — list published projects
- GET `/projects/:slug` — project detail
- GET `/posts` — list published posts
- GET `/posts/:slug` — post detail
- GET `/docs` — list published docs (supports `?section=`)
- GET `/docs/:slug` — doc detail

Authenticated (editor/admin):

- POST `/register` — create admin/editor (one-time local bootstrap)
- POST `/login` — issue JWT cookie
- POST `/logout` — clear JWT cookie
- GET `/me` — current user
- POST `/projects` — create project
- PATCH `/projects/:id` — update project
- DELETE `/projects/:id` — delete project (admin)
- POST `/posts` — create post
- PATCH `/posts/:id` — update post
- POST `/docs` — create doc
- PATCH `/docs/:id` — update doc

Request bodies follow backend schemas; slugs are auto-generated if omitted.

---

## Frontend Responsibilities

- **Public surfaces**: Render published content only. Never show drafts on public routes.
- **Draft/preview**: Provide a guarded preview flow for editors (e.g., dashboard-only preview toggles) by calling draft endpoints with credentials; do not cache draft content publicly.
- **Slug usage**: Always navigate by slug for detail pages. Respect uniqueness; do not mutate slugs client-side once persisted.
- **Status handling**: When publishing from dashboard, set `status` to `published`; backend will set `publishedAt`.
- **Forms**: Validate required fields (title/body, section for docs). Show field-level errors from backend `errors: [{ field, message }]`.
- **Error handling**: On 401 -> redirect to login; on 403 -> show forbidden; on 404 -> render not-found.
- **Data fetching**: Use server components where possible for SEO pages; client components for interactive dashboard forms. Cache public fetches with `revalidate` (short TTL) and tag invalidation hooks if needed.
- **Accessibility**: Semantic landmarks, focus management on route transitions, alt text for images.

---

## Styling & UX Guardrails

- Tailwind-first. Define design tokens in `globals.css` (colors, spacing, typography). Avoid inline styles except for dynamic values.
- Layouts: responsive with mobile-first stacks; max-width containers; generous whitespace.
- Components: buttons/links share consistent variants (primary/secondary/ghost). Use disabled states for pending requests.
- Loading states: skeletons for lists/detail; inline spinners for form submits.
- Empty states: concise messaging with a CTA (e.g., "No posts yet" + link to dashboard for editors when authenticated).
- Do not block on JS for basic content: server-render lists/detail pages.

---

## Authentication UX

- Store no JWT in JS; rely on HTTP-only cookie from backend.
- `fetch` calls that need auth must set `credentials: "include"` and `Content-Type: application/json` when sending JSON.
- After login, revalidate or refetch protected data. On logout, clear client-side user state and refresh.

---

## Environment Variables (frontend)

```
NEXT_PUBLIC_API_BASE=http://localhost:5000
NEXT_PUBLIC_SITE_NAME=PunoX
```

`NEXT_PUBLIC_API_BASE` is required for all API calls.

---

## Performance & SEO

- Use Next.js metadata export in layouts/pages for titles/descriptions from content SEO fields (`seoTitle`, `seoDescription`).
- Optimize images (Next `<Image />`) when URLs are available; fall back to responsive `<img>` with `loading="lazy"`.
- Prefer static or ISR for published content pages; keep revalidate short (e.g., 60s) and allow manual revalidation hooks later.

---

## Logging & Errors

- Never log secrets. Console logs should be stripped from production code paths; keep minimal and purposeful.
- Surface backend error messages to users when safe; otherwise show generic fallback.

---

## Security Considerations

- Do not expose draft content on public routes.
- Always send credentials for protected operations; never store tokens in localStorage.
- Sanitize/escape user-rendered content if coming from rich text; assume markdown/plaintext unless otherwise specified.

---

## Definition of Done (frontend)

- Pages render published content from backend endpoints.
- Auth flows (login/logout/me) function with HTTP-only cookie.
- Editors/admins can create/update content via dashboard forms with validation and error display.
- Routing by slug works for projects/posts/docs.
- SEO fields are applied to page metadata.
- Responsive layouts with accessible semantics and loading/empty/error states.
