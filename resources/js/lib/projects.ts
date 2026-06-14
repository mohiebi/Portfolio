export type ProjectPreview =
  | "tasks"
  | "cash"
  | "routine"
  | "design"
  | "jobs"
  | "books"
  | "realestate";

export type PortfolioProject = {
  name: string;
  href: string;
  external?: boolean;
  featured: boolean;
  tag: string;
  outcome: string;
  blurb: string;
  features: string[];
  tech: string[];
  accent: string;
  preview: ProjectPreview;
};

export const projects: PortfolioProject[] = [
  {
    name: "TaskManager",
    href: "/taskmanager",
    featured: true,
    tag: "Productivity dashboard",
    outcome: "Eliminates missed tasks with per-user auth scoping, fast status updates, and a focused task flow.",
    blurb: "Authenticated task system with per-user scoping, subtasks, real-time toggle states, and flash feedback. Demonstrates clean Laravel auth architecture.",
    features: ["Create / edit / delete tasks", "Toggle completed state", "Auth-scoped per user"],
    tech: ["Laravel", "Inertia", "React", "Tailwind"],
    accent: "from-emerald-400/25 to-teal-500/10",
    preview: "tasks",
  },
  {
    name: "CashPilot",
    href: "https://cashpilot.mohiebi.com",
    external: true,
    featured: true,
    tag: "Finance manager",
    outcome: "A personal finance workspace for tracking cash flow, categories, and day-to-day money decisions.",
    blurb: "CashPilot is a finance project built around clean transaction management, practical summaries, and a calmer way to understand where money is going.",
    features: ["Transaction tracking", "Category-based summaries", "Subdomain-ready product"],
    tech: ["Laravel", "Finance workflows", "Dashboard UX", "cashpilot.mohiebi.com"],
    accent: "from-lime-400/25 to-cyan-500/10",
    preview: "cash",
  },
  {
    name: "AI Routine Coach",
    href: "https://t.me/AIRoutineCoachBot",
    external: true,
    featured: true,
    tag: "AI routine bot",
    outcome: "Turns personal goals into a routine coaching flow that can help users plan and stay consistent.",
    blurb: "A focused AI project for daily planning, routine guidance, and habit support. It shows practical AI integration around a real user workflow.",
    features: ["Routine coaching flow", "Goal-aware planning", "Telegram bot delivery"],
    tech: ["AI integration", "Prompt design", "Telegram", "@AIRoutineCoachBot"],
    accent: "from-fuchsia-400/25 to-violet-500/10",
    preview: "routine",
  },
  {
    name: "Mahdieh Design",
    href: "https://mahdiehdesign.com",
    external: true,
    featured: true,
    tag: "Client website",
    outcome: "A polished public website for a design brand, built to present work clearly and convert visitors.",
    blurb: "Mahdieh Design is a client-facing site with a visual-first presentation, responsive layout, and a straightforward path from browsing to contact.",
    features: ["Responsive brand site", "Portfolio-style presentation", "Clear visitor journey"],
    tech: ["Frontend", "Responsive UI", "Brand website", "Deployment"],
    accent: "from-pink-400/25 to-amber-400/10",
    preview: "design",
  },
  {
    name: "Job Board",
    href: "/jobs",
    featured: false,
    tag: "SaaS-style marketplace",
    outcome: "A two-sided marketplace connecting employers and applicants with policy-protected, multi-role flows.",
    blurb: "Full marketplace with filterable listings, CV upload, employer dashboard, and Laravel Policies enforcing role-based access.",
    features: ["Salary / experience / category filters", "PDF CV upload", "Employer job management"],
    tech: ["Laravel", "Policies", "File uploads", "Tailwind"],
    accent: "from-sky-400/25 to-indigo-500/10",
    preview: "jobs",
  },
  {
    name: "BookReview",
    href: "/books",
    featured: false,
    tag: "Discovery and ratings",
    outcome: "Turns a flat book list into a searchable, filterable discovery engine with social proof.",
    blurb: "Discovery app with smart filters, average ratings aggregated from threaded reviews, and a fast search experience.",
    features: ["Filter by popularity and rating", "Star ratings and review counts", "Detail page with reviews"],
    tech: ["Laravel", "Eloquent", "Blade", "Tailwind"],
    accent: "from-amber-400/30 to-orange-500/10",
    preview: "books",
  },
  {
    name: "Real Estate",
    href: "/listing",
    featured: false,
    tag: "Property marketplace",
    outcome: "Full property marketplace with bidding, image management, and realtor dashboards.",
    blurb: "End-to-end real estate platform with advanced filters, buyer offer system with notifications, and a realtor CRUD panel.",
    features: ["Filter by price, beds, baths, area", "Buyer offer system with notifications", "Realtor CRUD + image management"],
    tech: ["Laravel", "Inertia", "Policies", "Storage"],
    accent: "from-rose-400/25 to-pink-500/10",
    preview: "realestate",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
