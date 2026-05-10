# Portfolio

Personal portfolio and full-stack demo application for MohammadHosein Ebrahimi. The site combines a polished Inertia/React portfolio with three runnable product demos: BookReview, TaskManager, and Job Board.

## Stack

- Laravel 13 and PHP 8.3
- Inertia.js 2 with React 19 and TypeScript
- Vite 7
- Tailwind CSS 4 with Radix UI primitives and shadcn-style components
- MySQL
- Laravel Socialite for Google authentication
- PHPUnit 12 and Laravel Pint

## Features

- Portfolio landing page with selected projects, skills, experience, CV download, and contact links.
- Contact form that stores service requests.
- Email/password authentication, email verification flow, profile management, and Google sign-in.
- BookReview: searchable book catalog, popularity/rating filters, review counts, average ratings, and authenticated review submission.
- TaskManager: authenticated user-scoped task CRUD with validation, flash messages, and complete/incomplete toggling.
- Job Board: filterable jobs, job details, CV-based applications, employer registration, employer job management, and application tracking.

## Requirements

- PHP 8.3+
- Composer
- Node.js 22+
- MySQL 8+

## Local Setup

Install PHP and JavaScript dependencies:

```bash
composer install
npm install
```

Create the environment file and application key:

```bash
cp .env.example .env
php artisan key:generate
```

Configure the database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myportfolio
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seed demo data:

```bash
php artisan migrate --seed
```

Start the Laravel and Vite development servers:

```bash
php artisan serve
npm run dev
```

Open `http://127.0.0.1:8000`.

## Optional Google Login

Google authentication is wired through Laravel Socialite. Add credentials to `.env` when you want to use it locally:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALL_BACK=http://127.0.0.1:8000/auth/google/callback
```

## Useful Routes

- `/` - portfolio home
- `/books` - BookReview catalog
- `/jobs` - Job Board listings
- `/taskmanager` - authenticated TaskManager
- `/dashboard` - verified admin dashboard
- `/profile` - authenticated profile settings

## Development Commands

```bash
npm run dev
npm run build
php artisan test
vendor/bin/pint
```

## Notes

- Seed data creates books, reviews, users, employers, jobs, and applications for local exploration.
- Job applications support CV uploads.
- The default mail configuration logs mail locally; configure a real mailer before production use.
- Keep `.env` local only. Use `.env.example` for shareable configuration defaults.
