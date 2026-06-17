# MohammadHosein Ebrahimi Portfolio

This repository contains my personal portfolio website and a set of interactive full-stack sample projects. It is built as a working product rather than a static resume: the site combines a polished portfolio homepage, database-backed content areas, business service pages, project showcases, authentication, and runnable Laravel/Inertia demo applications.

The portfolio presents my work as a backend-focused full-stack engineer across Laravel, Symfony, Node/NestJS, React, Vue, APIs, automation, AI integrations, and Web3 product work.

## What This Portfolio Shows

- A modern personal homepage with profile, services, recommendations, featured projects, case studies, articles, about, and contact sections.
- A full projects archive at `/projects`, with one-column project showcases, visual previews, project details, and external app links where relevant.
- Featured projects on the homepage in this order: TaskManager, CashPilot, AI Routine Coach, and Mahdieh Design.
- Database-backed service packages with public service pages and dashboard management.
- Service sample projects, so a service can show real examples such as Mahdieh Design for Launch Sprint and CashPilot for Operations System Sprint.
- Authenticated application flows including registration, login, email verification, profile management, and Google sign-in.
- Real Laravel patterns: Eloquent models, migrations, controllers, form requests, policies, route model binding, seed data, and dashboard CRUD.
- React/Inertia UI patterns: reusable pages, typed props, responsive layouts, animation, project mockups, and accessible controls.

## Technology Stack

### Backend

- **Laravel 13** for routing, controllers, validation, authentication, policies, and database access.
- **PHP 8.3+** for the backend application layer.
- **Eloquent ORM** for portfolio content, services, service sample projects, books, reviews, tasks, jobs, employers, applications, listings, and offers.
- **Laravel Socialite** for Google authentication.
- **MariaDB / MySQL** for application data.
- **PHPUnit** for automated feature testing.
- **Laravel Pint** for PHP code style.

### Frontend

- **Inertia.js 2** connects Laravel routes to React pages without a separate API-only frontend.
- **React 19** and **TypeScript** power the UI.
- **Vite 7** builds frontend assets.
- **Tailwind CSS 4** provides the styling system.
- **Radix UI** and shadcn-style components provide accessible primitives.
- **Lucide React** supplies icons.
- **Framer Motion** adds page and component animation.

### Supporting Tools

- **Docker Compose** provides local database tooling.
- **Seeders and factories** create realistic sample data for demos.
- **Ziggy** supports Laravel route integration in frontend code where needed.

## Portfolio Website

The homepage introduces MohammadHosein Ebrahimi as a backend-focused full-stack engineer and guides visitors through services, recommendations, featured builds, case studies, background, writing, and contact options.

It includes:

- A hero section with availability, role summary, service CTA, and CV download.
- A services section focused on business outcomes: launch-ready websites, operations systems, and AI-enabled platforms.
- A recommendations section backed by manageable recommendation content.
- A projects section that highlights the top four projects.
- A case studies section for deeper professional/project narratives.
- An about section with experience, education, and skills.
- An articles section for technical notes and build logs.
- A contact section with Calendly, email, LinkedIn, and GitHub paths.

## Projects

Project data is maintained in `resources/js/lib/projects.ts`. The homepage shows the featured projects, and `/projects` shows the full archive with larger one-column project cards and visual mockups.

### Featured Projects

#### TaskManager

TaskManager is an authenticated productivity demo. It shows a clean task workflow where tasks belong to the current user and can be created, edited, deleted, scoped, and marked complete.

Key capabilities:

- Create, edit, and delete tasks.
- Toggle completed state.
- Keep task data scoped to the authenticated user.
- Use Laravel validation, flash feedback, and focused dashboard UI.

#### CashPilot

CashPilot is a finance project for tracking cash flow, categories, and day-to-day money decisions. It is linked as an external project at `https://cashpilot.mohiebi.com`.

Key capabilities shown in the portfolio:

- Transaction tracking.
- Category-based summaries.
- Finance dashboard UX.
- Operations-system style product structure.

CashPilot is also attached to the Operations System Sprint service as a sample build.

#### AI Routine Coach

AI Routine Coach is a Telegram bot project at `https://t.me/AIRoutineCoachBot`. It demonstrates practical AI integration around planning, habit support, and routine coaching.

Key capabilities shown in the portfolio:

- Routine coaching flow.
- Goal-aware planning.
- Telegram bot delivery.
- Prompt and workflow design.

#### Mahdieh Design

Mahdieh Design is a client-facing brand website at `https://mahdiehdesign.com`. It demonstrates a polished launch-style website with responsive presentation and a clear visitor journey.

Key capabilities shown in the portfolio:

- Responsive brand site.
- Portfolio-style presentation.
- Clear path from browsing to contact.
- Launch-sprint style delivery.

Mahdieh Design is also attached to the Launch Sprint service as a sample build.

### Additional Project Archive

The full projects page also includes:

- **Job Board** - marketplace-style listings, applications, employer management, CV upload, and role-protected actions.
- **BookReview** - book discovery, ratings, review counts, filters, and authenticated review submission.
- **Real Estate** - property listings, filters, image management, buyer offers, notifications, and realtor workflows.

## Services System

The services system is database-backed and managed through dashboard CRUD. Public pages are rendered through Inertia and Laravel controllers.

### Public Service Pages

- `/services` - services landing page with packages, comparison, bonuses, guarantees, process, and CTA sections.
- `/services/launch-sprint` - fast website launch package for a modern, credible, lead-ready business presence.
- `/services/operations-system-sprint` - custom systems package for replacing manual workflows with dashboards, automation, portals, and backend infrastructure.
- `/services/ai-operations-platform` - premium platform package for scalable internal tools, AI workflows, integrations, analytics, and long-term operational growth.

Each service detail page includes:

- Hero and service promise.
- Problem statement.
- Deliverables.
- Practical AI capabilities when available.
- Transformation from before to after.
- Sample builds attached to that service.
- Bonuses, guarantees, CTA, and links to other services.

### Service Sample Projects

Services can have related sample projects through the `service_projects` table and `ServiceProject` model.

Current seeded examples:

- **Launch Sprint** -> Mahdieh Design.
- **Operations System Sprint** -> CashPilot.

Future samples can be added from the dashboard service form using the `Sample projects` field. Each line follows this format:

```text
Name | URL | Tag | Summary | Outcome | Preview | Accent | Order
```

Supported preview types include `web`, `design`, `cash`, `tasks`, `routine`, `jobs`, `books`, and `realestate`.

## Dashboard Content Management

Authenticated admin/dashboard areas support managing portfolio content:

- Services and service sample projects.
- Case studies.
- Articles.
- Recommendations.
- Project/demo application areas.

Service edits are validated with `ServiceRequest`, persisted through `ServiceController`, and related sample projects are synced through the `Service::sampleProjects()` relationship.

## Application Areas

- `/` - Portfolio homepage.
- `/projects` - Full projects archive.
- `/services` - Main services landing page.
- `/services/{service:slug}` - Service detail pages.
- `/case-studies` - Public case studies index.
- `/case-studies/{caseStudy:slug}` - Case study detail pages.
- `/articles` - Public articles index.
- `/articles/{article:slug}` - Article detail pages.
- `/recommendations/all` - Public recommendations archive.
- `/books` - BookReview catalog and detail pages.
- `/taskmanager` - Authenticated task management demo.
- `/jobs` - Job Board listings and detail pages.
- `/my-jobs` - Employer job management area.
- `/my-job-applications` - User application tracking area.
- `/listing` - Real estate listing area.
- `/dashboard` - Authenticated dashboard.
- `/profile` - Authenticated profile settings.

## Data Model Overview

The application uses separate models for each area:

- **Service** and **ServiceProject** power service packages and related sample builds.
- **CaseStudy** powers portfolio case studies.
- **Article** powers technical writing.
- **Recommendation** powers public recommendation content.
- **Book** and **Review** power the BookReview demo.
- **Task** powers the TaskManager demo.
- **Job**, **Employer**, and **JobApplication** power the Job Board demo.
- **Listing**, **ListingImage**, and **Offer** power the real estate demo.
- **User** connects authentication, roles, ownership, applications, and profile behavior.
- **Contact** stores contact/service inquiry data.

This structure keeps the portfolio content and each sample application understandable while still showing realistic relationships, ownership, validation, authorization, and dashboard workflows.

## Development

Install dependencies:

```bash
composer install
npm install
```

Prepare the environment:

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

Run the frontend dev server:

```bash
npm run dev
```

Build frontend assets:

```bash
npm run build
```

Run backend tests when PHP is available locally:

```bash
php artisan test
```

Run PHP formatting:

```bash
php vendor/bin/pint
```

## Notes For Future Updates

- Add or reorder public project cards in `resources/js/lib/projects.ts`.
- Add service packages through the dashboard service area or service migrations.
- Attach service proof/sample builds through the dashboard service form.
- Keep public project links pointed at product URLs or live demos rather than GitHub repositories.
- Run `php artisan migrate` after pulling migrations that add service or content relationships.

## Purpose

The purpose of this repository is to present my portfolio as a working product. It shows how I structure real Laravel/Inertia applications: clear business positioning, polished interfaces, database-backed content, validation, authorization, admin workflows, and focused product demos that explain both technical ability and practical outcomes.
