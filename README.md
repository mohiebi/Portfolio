# MohammadHosein Ebrahimi Portfolio

This repository contains my personal portfolio website and a set of interactive full-stack sample projects. The site presents my background as a full-stack developer, highlights my PHP, JavaScript, and Web3 experience, and gives visitors runnable examples of the kinds of product features I build.

The portfolio is designed as more than a static profile. It includes a business-focused services system, real application flows, authentication, database-backed content, filtering, file uploads, authorization rules, and polished React interfaces so the projects can be explored like small production features.

## What This Portfolio Shows

- A modern personal homepage with my profile, experience, education, skills, CV, and contact links.
- A complete services landing page with dedicated service detail pages for business websites, operations systems, and AI-enabled platforms.
- A project gallery that links to three full-stack demos: BookReview, TaskManager, and Job Board.
- Authenticated user flows including registration, login, email verification, profile management, and Google sign-in.
- Backend patterns such as Eloquent models, form requests, policies, controllers, seed data, and database migrations.
- Frontend patterns using React, TypeScript, Inertia.js, Tailwind CSS, motion, reusable UI components, and responsive layouts.

## Technology Stack

### Backend

- **Laravel 13** powers the application, routing, controllers, validation, policies, authentication, and database access.
- **PHP 8.3** is used for the backend application layer.
- **Eloquent ORM** models the portfolio data, books, reviews, tasks, jobs, employers, and applications.
- **Laravel Socialite** provides Google authentication.
- **MariaDB / MySQL** stores the portfolio and sample project data.
- **PHPUnit** is used for automated feature testing.
- **Laravel Pint** keeps the PHP code style consistent.

### Frontend

- **Inertia.js 2** connects Laravel routes to React pages without requiring a separate API-only frontend.
- **React 19** and **TypeScript** power the interactive UI.
- **Vite 7** builds the frontend assets.
- **Tailwind CSS 4** handles the styling system.
- **Radix UI** and shadcn-style components provide accessible interface primitives.
- **Lucide React** supplies icons across the portfolio and project interfaces.
- **Framer Motion** adds smooth page and component animation.

### Supporting Tools

- **Docker Compose** defines a MariaDB database container and a phpMyAdmin container for database inspection during development.
- **Seeders and factories** create realistic sample data for books, reviews, users, employers, jobs, and applications.

## Portfolio Website

The main portfolio page introduces me as MohammadHosein Ebrahimi, a full-stack developer focused on PHP, JavaScript, Laravel, Symfony, Vue, NestJS, and Solidity/Web3 work.

It includes:

- A hero section with availability, role summary, services CTA, GitHub link, and CV download.
- A services CTA section that introduces business-focused web systems, backend platforms, automation tools, and AI-powered tools.
- A services landing page with package comparison, bonuses, guarantees, process, and conversion-focused contact CTAs.
- Dedicated service pages for Launch Sprint, Operations System Sprint, and AI Operations Platform.
- A project section with visual previews for the sample applications.
- An about section with experience, education, and technical skills.
- A contact section with email, LinkedIn, GitHub, and direct CV access.

Visitors can use the site to understand my technical background, inspect selected work, and navigate into each sample project.

## Services System

The portfolio includes a complete services section built from reusable React and Inertia pages. It positions my work around practical business outcomes instead of only technical skills.

### Main Services Page

The `/services` page introduces all service packages and helps visitors compare the right level of support for their business.

It includes:

- A business-outcome hero section with consultation and service navigation CTAs.
- Service cards for each package with the best-fit client, key outcome, timeline, price range, and detail-page link.
- A comparison section covering investment, timeline, scope, outcome, and value.
- Bonuses and guarantees pulled into trust-building sections.
- A step-by-step working process from discovery through launch and improvement.
- A final CTA that sends visitors to the portfolio contact section.

### Service Detail Pages

Each service has its own dedicated page:

- `/services/launch-sprint` - a fast website launch package for a modern, credible, lead-ready business presence.
- `/services/operations-system-sprint` - an internal systems package for replacing manual workflows with dashboards, automation, portals, and backend infrastructure.
- `/services/ai-operations-platform` - a premium platform package for scalable internal tools, AI workflows, integrations, analytics, security, and long-term operational growth.

Each detail page includes the service hero, problem statement, deliverables, included scope, ideal client fit, benefits, process, bonuses, guarantees, CTA, and links to the other services.

### Services Content and Assets

Service content is centralized in `resources/js/lib/services.ts` so package data, copy, inclusions, bonuses, guarantees, images, and route slugs can be maintained in one place.

Service visuals are stored in `public/img/services`:

- `services-overview.png`
- `launch-sprint.png`
- `operations-system-sprint.png`
- `ai-operations-platform.png`

## Sample Projects

### BookReview

BookReview is a discovery and ratings demo for browsing books and reading reviews. It demonstrates how I structure catalog-style applications with filtering, detail pages, aggregate ratings, and user-generated content.

Key capabilities:

- Browse a database-backed book catalog.
- Search and filter books by popularity and rating.
- View book details with average ratings and review counts.
- Submit reviews through an authenticated flow.
- Use seeded content to simulate a realistic review platform.

This project is useful as an example of building read-heavy product pages, review systems, filterable indexes, and relational data with Laravel and Eloquent.

### TaskManager

TaskManager is an authenticated productivity demo. It shows a clean CRUD workflow where tasks belong to the current user and can be created, edited, deleted, and marked complete.

Key capabilities:

- Create, edit, and delete tasks.
- Toggle tasks between complete and incomplete.
- Keep task data scoped to the authenticated user.
- Validate task input through Laravel form requests.
- Display feedback and empty states in a simple dashboard-style UI.

This project is useful as an example of authenticated user-owned resources, validation, flash messages, and small workflow-focused interfaces.

### Job Board

Job Board is a marketplace-style sample application for listings, applications, and employer management. It demonstrates a more complete product flow with multiple user roles and protected actions.

Key capabilities:

- Browse and filter job listings.
- View detailed job pages.
- Apply to jobs with CV upload support.
- Register as an employer.
- Manage employer-owned job posts.
- Track submitted job applications.
- Protect employer actions with Laravel policies and middleware.

This project is useful as an example of building SaaS-style features with listings, ownership, authorization, file uploads, and multi-step user journeys.

## Application Areas

The site includes several main areas:

- `/` - Portfolio homepage.
- `/services` - Main services landing page.
- `/services/launch-sprint` - Launch Sprint service detail page.
- `/services/operations-system-sprint` - Operations System Sprint service detail page.
- `/services/ai-operations-platform` - AI Operations Platform service detail page.
- `/case-studies` - Public case studies index.
- `/case-studies/{slug}` - Public case study detail pages.
- `/books` - BookReview catalog and book detail pages.
- `/taskmanager` - Authenticated task management demo.
- `/jobs` - Job Board listings and job details.
- `/my-jobs` - Employer job management area.
- `/my-job-applications` - User application tracking area.
- `/dashboard` - Authenticated dashboard.
- `/profile` - Authenticated profile settings.

These routes are intended to show how the portfolio moves from a personal landing page into practical, database-backed application examples.

## Development Notes

Common checks:

- `npm run build` builds the Vite frontend assets.
- `./node_modules/.bin/tsc.cmd --noEmit` runs TypeScript checking on Windows PowerShell without relying on `npx`.
- `php artisan test` runs the Laravel test suite when PHP is available locally.

The services pages are static Inertia pages backed by frontend data. Adding a future service requires updating `resources/js/lib/services.ts`, adding the service image to `public/img/services`, and allowing the slug in `routes/web.php`.

## Data Model Overview

The portfolio uses separate models for each project area:

- **Book** and **Review** power the BookReview demo.
- **Task** powers the TaskManager demo.
- **Job**, **Employer**, and **JobApplication** power the Job Board demo.
- **User** connects authentication, roles, task ownership, applications, and employer accounts.
- **Contact** stores service or contact requests from the portfolio.

This structure keeps the sample projects easy to understand while still showing realistic relationships between users, content, ownership, and actions.

## Purpose

The purpose of this repository is to present my portfolio as a working product, not only as a resume page. The services pages explain how I help businesses with launch-ready websites, backend systems, automation, and AI-enabled platforms. Each included project is a compact case study that demonstrates how I approach full-stack development: clear interfaces, practical backend structure, validation, authorization, database design, and user-focused workflows.
